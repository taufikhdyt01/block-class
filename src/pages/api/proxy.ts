import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import { createReadStream } from 'fs';
import type { Files, Fields, File } from 'formidable';
import fetch from 'node-fetch';
import type { RequestInit } from 'node-fetch';
import FormData from 'form-data';

export const config = {
  api: {
    bodyParser: false,
  },
};

const API_URL = process.env.API_URL || 'https://api-eblock.my.id/api';

interface FormidableFile extends File {
  filepath: string;
  originalFilename: string | null;
  mimetype: string | null;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, query } = req;
  const { path, ...restQuery } = query;
  const queryString = new URLSearchParams(restQuery as Record<string, string>).toString();
  const url = `${API_URL}/${path}${queryString ? `?${queryString}` : ''}`;

  try {
    // Handle multipart/form-data requests
    if (req.headers['content-type']?.includes('multipart/form-data')) {
      const form = formidable({});
      
      const [fields, files] = await new Promise<[Fields, Files]>((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) reject(err);
          resolve([fields, files]);
        });
      });

      const formData = new FormData();

      // Add fields
      Object.entries(fields).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach(v => formData.append(key, v));
        } else {
          formData.append(key, value);
        }
      });

      // Add files
      Object.entries(files).forEach(([key, fileData]) => {
        if (!fileData) return;

        if (Array.isArray(fileData)) {
          fileData.forEach((file) => {
            const formidableFile = file as FormidableFile;
            if (formidableFile.filepath && formidableFile.originalFilename && formidableFile.mimetype) {
              formData.append(key, createReadStream(formidableFile.filepath), {
                filename: formidableFile.originalFilename || 'file',
                contentType: formidableFile.mimetype
              });
            }
          });
        } else {
          const formidableFile = fileData as FormidableFile;
          if (formidableFile.filepath && formidableFile.originalFilename && formidableFile.mimetype) {
            formData.append(key, createReadStream(formidableFile.filepath), {
              filename: formidableFile.originalFilename || 'file',
              contentType: formidableFile.mimetype
            });
          }
        }
      });

      const headers = {
        ...formData.getHeaders(),
        'Accept': 'application/json',
        ...(req.headers.authorization ? { 'Authorization': req.headers.authorization as string } : {})
      };

      const fetchOptions: RequestInit = {
        method,
        body: formData as any,
        headers
      };

      const response = await fetch(url, fetchOptions);
      const data = await response.json();
      return res.status(response.status).json(data);
    }

    // Handle GET requests and JSON requests
    let body: string | undefined;
    
    if (method !== 'GET') {
      body = await new Promise<string>((resolve) => {
        let data = '';
        req.on('data', chunk => { data += chunk; });
        req.on('end', () => { resolve(data); });
      });
    }

    const headers: Record<string, string> = {
      'Accept': 'application/json',
      ...(req.headers.authorization ? { 'Authorization': req.headers.authorization as string } : {})
    };

    // Add Content-Type for non-GET requests with body
    if (method !== 'GET' && body) {
      headers['Content-Type'] = 'application/json';
    }

    const fetchOptions: RequestInit = {
      method,
      headers,
      ...(body ? { body } : {})
    };

    const response = await fetch(url, fetchOptions);
    const data = await response.json();
    return res.status(response.status).json(data);

  } catch (error) {
    console.error('Proxy Error:', error);
    return res.status(500).json({ 
      message: 'Error connecting to API', 
      error: error instanceof Error ? error.message : String(error)
    });
  }
}