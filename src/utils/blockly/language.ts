// utils/blockly/language.ts
import * as Blockly from 'blockly';

// Import message files langsung
import 'blockly/msg/en';
import 'blockly/msg/id';

type BlocklyLanguage = 'en' | 'id';

// Simpan messages Inggris original
let originalMessages: { [key: string]: string } = {};

export function setBlocklyLanguage(lang: BlocklyLanguage) {
  if (typeof window === 'undefined') return;

  try {
    // Simpan messages Inggris jika belum disimpan
    if (Object.keys(originalMessages).length === 0) {
      originalMessages = { ...Blockly.Msg };
    }

    if (lang === 'en') {
      // Kembalikan ke messages Inggris original
      Object.assign(Blockly.Msg, originalMessages);
    } else if (lang === 'id') {
      // Load messages Indonesia
      const idLocale = require('blockly/msg/id');
      Object.assign(Blockly.Msg, idLocale);
    }

    // Update workspace yang ada
    const workspace = Blockly.getMainWorkspace();
    if (workspace && workspace instanceof Blockly.WorkspaceSvg) {
      // Refresh semua blok
      workspace.getAllBlocks(false).forEach(block => {
        if (block.isEnabled()) {
          block.setEnabled(false);
          block.setEnabled(true);
        }
      });

      // Update toolbox jika ada
      const flyout = workspace.getFlyout();
      if (flyout) {
        flyout.setVisible(false);
        flyout.setVisible(true);
      }

      // Resize workspace
      Blockly.svgResize(workspace);
    }
  } catch (e) {
    console.error('Error updating language:', e);
  }
}

export function initBlocklyLanguage(lang: BlocklyLanguage) {
  if (typeof window === 'undefined') return;
  setBlocklyLanguage(lang);
}

// Nama kategori dalam berbagai bahasa
export const CATEGORY_NAMES = {
  en: {
    LOGIC: 'Logic',
    LOOPS: 'Loops',
    MATH: 'Math',
    TEXT: 'Text',
    LISTS: 'Lists',
    COLOR: 'Color',
    VARIABLES: 'Variables',
    FUNCTIONS: 'Functions'
  },
  id: {
    LOGIC: 'Logika',
    LOOPS: 'Perulangan',
    MATH: 'Matematika',
    TEXT: 'Teks',
    LISTS: 'Array',
    COLOR: 'Warna',
    VARIABLES: 'Variabel',
    FUNCTIONS: 'Fungsi'
  }
};