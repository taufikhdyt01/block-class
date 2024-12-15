export interface Image {
    url: string;
    caption: string;
}

export interface Section {
    title: string;
    content: string;
    images: Image[];
}

export interface ModificationStep {
    content: string;
    image: Image;
}

export interface Modification {
    title: string;
    description: string;
    steps: ModificationStep[];
}

export interface Category {
    title: string;
    description: string;
    sections: Section[];
    modification?: Modification;
}

export interface Categories {
    [key: string]: Category;
}

export const Categories: Categories = {
    percabangan: {
        title: "Percabangan (If)",
        description: "Pernyataan kondisional adalah inti dari pemrograman komputer. Mereka memungkinkan kita untuk membuat ekspresi seperti: 'Jika ada jalan ke kiri, belok kiri' atau 'Jika skor = 100, tampilkan \"Bagus sekali!\"'",
        sections: [
            {
                title: "Blok If Sederhana",
                content: "Pernyataan kondisional paling sederhana adalah blok if. Ketika dijalankan, blok ini akan membandingkan nilai dari sebuah variabel dengan kondisi tertentu. Jika kondisi terpenuhi, kode di dalamnya akan dijalankan. Jika tidak, tidak ada yang terjadi.",
                images: [
                    {
                        url: "/block/if/if.png",
                        caption: "Contoh blok if sederhana yang membandingkan nilai x dengan 100"
                    }
                ]
            },
            {
                title: "Blok If-Else",
                content: "Dengan blok if-else, kita dapat menentukan aksi yang akan dijalankan ketika kondisi tidak terpenuhi. Sebuah blok if hanya dapat memiliki nol atau satu bagian else, tidak lebih.",
                images: [
                    {
                        url: "/block/if/if-else.png",
                        caption: "Blok if-else yang menampilkan pesan berbeda berdasarkan nilai x"
                    }
                ]
            },
            {
                title: "Blok If-Else-If",
                content: "Kita juga dapat menguji beberapa kondisi dengan satu blok if dengan menambahkan klausa else if. Kondisi akan dievaluasi dari atas ke bawah sampai salah satu kondisi terpenuhi.",
                images: [
                    {
                        url: "/block/if/if-else-if.png",
                        caption: "Blok if-else-if yang memeriksa beberapa kondisi"
                    }
                ]
            }
        ],
        modification: {
            title: "Memodifikasi Blok",
            description: "Anda dapat memodifikasi struktur blok if untuk menambah atau mengurangi kondisi sesuai kebutuhan.",
            steps: [
                {
                    content: "Hanya blok if dasar yang muncul di toolbox awal",
                    image: {
                        url: "/block/if/if-mod-1.png",
                        caption: "Blok if dasar di toolbox"
                    }
                },
                {
                    content: "Klik ikon roda gigi untuk membuka jendela konfigurasi",
                    image: {
                        url: "/block/if/if-mod-2.png",
                        caption: "Jendela konfigurasi blok"
                    }
                },
                {
                    content: "Tarik bagian else if dan else ke bawah blok if. Anda juga bisa mengatur urutan atau menghapusnya",
                    image: {
                        url: "/block/if/if-else.gif",
                        caption: "Menambahkan bagian else if dan else"
                    }
                }
            ]
        }
    },
    booleanLogic: {
        title: "Boolean",
        description: "Logika Boolean adalah sistem matematika sederhana yang memiliki dua nilai: true (benar) dan false (salah). Blok logika umumnya digunakan untuk mengontrol blok kondisional dan blok pengulangan.",
        sections: [
            {
                title: "Nilai Boolean",
                content: "Sebuah blok tunggal dengan dropdown yang menentukan benar (true) atau salah (false) dapat digunakan untuk mendapatkan nilai Boolean. Nilai Boolean ini dapat digunakan secara langsung dalam kondisi atau disimpan dalam variabel.",
                images: [
                    {
                        url: "/block/boolean/value.png",
                        caption: "Blok pemilihan nilai boolean true/false"
                    }
                ]
            },
            {
                title: "Operator Perbandingan",
                content: "Terdapat enam operator perbandingan yang masing-masing mengambil dua input (biasanya angka) dan mengembalikan true atau false tergantung pada bagaimana input tersebut dibandingkan. Operator-operator tersebut adalah: = (sama dengan), ≠ (tidak sama dengan), < (kurang dari), > (lebih dari), ≤ (kurang dari atau sama dengan),  ≥ (lebih dari atau sama dengan).",
                images: [
                    {
                        url: "/block/boolean/comparisons.png",
                        caption: "Contoh penggunaan operator perbandingan"
                    }
                ]
            },
            {
                title: "Operasi Logika",
                content: "Terdapat beberapa operasi logika dasar:\n\n1. AND: Blok 'and' akan mengembalikan true hanya jika kedua inputnya true.\n2. OR: Blok 'or' akan mengembalikan true jika salah satu dari kedua inputnya true.\n3. NOT: Blok 'not' mengkonversi input Boolean menjadi kebalikannya (true menjadi false, false menjadi true).",
                images: [
                    {
                        url: "/block/boolean/logical.png",
                        caption: "Contoh penggunaan operasi logika AND, OR, dan NOT"
                    }
                ]
            },
            {
                title: "Operator Ternary",
                content: "Operator ternary bertindak seperti blok if-else mini. Operator ini mengambil tiga input: kondisi Boolean yang akan diuji, nilai yang akan dikembalikan jika kondisi true, dan nilai yang akan dikembalikan jika kondisi false.",
                images: [
                    {
                        url: "/block/boolean/ternary.png",
                        caption: "Contoh penggunaan operator ternary"
                    },
                    {
                        url: "/block/if/if-else.png",
                        caption: "Perbandingan operator ternary dengan blok if-else"
                    }
                ]
            }
        ],
    },
    loops: {
        title: "Perulangan (Loops)",
        description: "Blok pengulangan (loops) adalah bagian dari kategori Control yang mengatur berapa kali blok-blok di dalam bodynya dijalankan. Setiap putaran dalam pengulangan disebut iterasi. Blok-blok ini memungkinkan kita untuk mengulang serangkaian perintah beberapa kali, baik dengan jumlah tertentu atau berdasarkan kondisi.",
        sections: [
            {
                title: "Repeat (Pengulangan Sederhana)",
                content: "Blok 'repeat' adalah bentuk pengulangan paling sederhana yang menjalankan kode dalam bodynya sejumlah tertentu kali. Misalnya, Anda dapat menggunakan blok ini untuk mencetak 'Hello!' sebanyak sepuluh kali.",
                images: [
                    {
                        url: "/block/loop/repeat.png",
                        caption: "Contoh blok repeat yang mencetak 'Hello!' sepuluh kali"
                    }
                ]
            },
            {
                title: "Repeat While (Pengulangan Selama)",
                content: "Blok 'repeat while' menjalankan kode dalam bodynya selama kondisi tertentu bernilai true. Misalnya, dalam sebuah permainan dadu, pemain melempar dadu dan menjumlahkan nilainya selama total kurang dari 30. Pengulangan akan terus berjalan sampai kondisi tidak terpenuhi.",
                images: [
                    {
                        url: "/block/loop/repeat-while.png",
                        caption: "Contoh penggunaan repeat while dalam permainan dadu"
                    }
                ]
            },
            {
                title: "Repeat Until (Pengulangan Sampai)",
                content: "Berbeda dengan 'repeat while' yang mengulang selama kondisi true, blok 'repeat until' mengulang sampai kondisi menjadi true. Ini adalah kebalikan dari 'repeat while'. Misalnya, pengulangan sampai total lebih besar atau sama dengan 30.",
                images: [
                    {
                        url: "/block/loop/repeat-until.png",
                        caption: "Contoh penggunaan repeat until dengan kondisi total >= 30"
                    }
                ]
            },
            {
                title: "Count With (For Loop)",
                content: "Blok 'count with' (dikenal sebagai for loop di kebanyakan bahasa pemrograman) menggerakkan sebuah variabel dari nilai awal ke nilai akhir dengan penambahan tertentu, menjalankan body sekali untuk setiap nilai. Blok ini dapat berjalan maju (nilai awal lebih kecil dari nilai akhir) atau mundur (nilai awal lebih besar dari nilai akhir).",
                images: [
                    {
                        url: "/block/loop/for-loop-plus.png",
                        caption: "Contoh count with yang mencetak angka 1, 3, dan 5"
                    },
                    {
                        url: "/block/loop/for-loop-minus.png",
                        caption: "Contoh count with mundur yang mencetak angka 5, 3, dan 1"
                    }
                ]
            },
            {
                title: "For Each (Untuk Setiap)",
                content: "Blok 'for each' mirip dengan count with, tetapi alih-alih menggunakan urutan angka, blok ini menggunakan nilai-nilai dari sebuah list secara berurutan. Misalnya, mencetak setiap elemen dari list: 'alpha', 'beta', 'gamma'.",
                images: [
                    {
                        url: "/block/loop/for-each.png",
                        caption: "Contoh penggunaan for each untuk mencetak elemen list"
                    }
                ]
            },
            {
                title: "Blok Penghentian Loop",
                content: "Terdapat dua blok khusus untuk mengontrol perilaku pengulangan:\n\n1. Continue with next iteration: Menyebabkan kode tersisa dalam body dilewati dan melanjutkan ke iterasi berikutnya.\n\n2. Break out of loop: Memberikan jalan keluar lebih awal dari pengulangan.",
                images: [
                    {
                        url: "/block/loop/continue.png",
                        caption: "Contoh penggunaan continue with next iteration"
                    },
                    {
                        url: "/block/loop/break.png",
                        caption: "Contoh penggunaan break out of loop"
                    }
                ]
            }
        ],
    },
    math: {
        title: "Matematika",
        description: "Kategori ini menyediakan berbagai blok untuk melakukan operasi matematika, mulai dari operasi dasar hingga fungsi matematika yang lebih kompleks seperti trigonometri, pembulatan, dan operasi dengan list angka.",
        sections: [
            {
                title: "Angka dan Operasi Dasar",
                content: "1. Number Block:\n- Blok dasar untuk memasukkan angka\n- Contoh: 123\n\n2. Arithmetic Block:\n- Melakukan operasi aritmatika dasar\n- Operasi: penjumlahan (+), pengurangan (-), perkalian (×), pembagian (÷), pemangkatan (^)\n- Contoh: 1 + 1, 5 × 3",
                images: [
                    {
                        url: "/block/math/arithmetic.png",
                        caption: "Blok number dan arithmetic"
                    }
                ]
            },
            {
                title: "Fungsi Matematika Dasar",
                content: "1. Single Function:\n- Akar kuadrat (√)\n- Nilai absolut (|x|)\n- Negasi (-x)\n- Logaritma natural (ln)\n- log10\n- e^x\n- 10^x\n\n2. Constants:\n- π (pi)\n- e (euler)\n- φ (golden ratio)\n- √2\n- √1/2\n- ∞ (infinity)",
                images: [
                    {
                        url: "/block/math/math-basic.png",
                        caption: "Fungsi matematika dasar dan konstanta"
                    }
                ]
            },
            {
                title: "Trigonometri",
                content: "Blok Trigonometri menyediakan fungsi:\n- sin (sinus)\n- cos (cosinus)\n- tan (tangen)\n- asin (arc sinus)\n- acos (arc cosinus)\n- atan (arc tangen)\n\nInput dalam derajat. Contoh: sin(45°)",
                images: [
                    {
                        url: "/block/math/trigonometri.png",
                        caption: "Blok fungsi trigonometri"
                    }
                ]
            },
            {
                title: "Properti dan Pengecekan Angka",
                content: "Number Property Block memungkinkan pengecekan:\n- Bilangan genap\n- Bilangan ganjil\n- Bilangan prima\n- Bilangan bulat\n- Bilangan positif\n- Bilangan negatif\n- Dapat dibagi dengan x",
                images: [
                    {
                        url: "/block/math/check-number.png",
                        caption: "Pengecekan properti angka"
                    }
                ]
            },
            {
                title: "Pembulatan dan Batasan",
                content: "1. Round Block:\n- Pembulatan ke atas (ceil)\n- Pembulatan ke bawah (floor)\n- Pembulatan terdekat (round)\n\n2. Constrain Block:\n- Membatasi nilai dalam rentang tertentu\n- Contoh: constrain(50) between 1 and 100",
                images: [
                    {
                        url: "/block/math/ceil-constrain.png",
                        caption: "Blok pembulatan dan pembatasan nilai"
                    }
                ]
            },
            {
                title: "Operasi List dan Modulo",
                content: "1. Math on List:\n- Menjumlahkan semua item dalam list\n- Mencari nilai minimum dalam list\n- Mencari nilai maksimum dalam list\n- Menghitung rata-rata list\n- Mencari median list\n- Mencari modus list\n- Menghitung standar deviasi\n- Mencari elemen random dari list\n\n2. Modulo:\n- Menghitung sisa pembagian\n- Contoh: 64 mod 10 = 4",
                images: [
                    {
                        url: "/block/math/list-mod.png",
                        caption: "Operasi matematika pada list dan modulo"
                    }
                ]
            },
            {
                title: "Nilai Random",
                content: "1. Random Integer:\n- Menghasilkan bilangan bulat acak dalam rentang tertentu\n- Contoh: random integer from 1 to 100\n\n2. Random Fraction:\n- Menghasilkan pecahan acak antara 0 dan 1",
                images: [
                    {
                        url: "/block/math/random.png",
                        caption: "Blok random"
                    }
                ]
            }
        ],
    },
    text: {
        title: "Teks",
        description: "Text dapat berisi huruf (baik huruf kecil maupun besar), angka, tanda baca, simbol lain, dan spasi antar kata. Semua jenis karakter ini disebut sebagai character dalam istilah non-Blockly.",
        sections: [
            {
                title: "Pembuatan Teks",
                content: "Terdapat beberapa cara untuk membuat dan menggabungkan teks:\n\n1. Blok teks sederhana untuk membuat teks seperti 'hello'\n2. Blok 'create text with' untuk menggabungkan (concatenate) beberapa teks\n3. Jumlah input teks dapat ditambah dengan mengklik ikon roda gigi dan menarik blok 'item' ke dalam blok 'join'",
                images: [
                    {
                        url: "/block/text/create.png",
                        caption: "Contoh pembuatan teks sederhana"
                    },
                    {
                        url: "/block/text/create-with.png",
                        caption: "Menggabungkan teks dengan create text with"
                    }
                ]
            },
            {
                title: "Modifikasi Teks",
                content: "Blok 'to...append text' menambahkan teks yang diberikan ke variabel yang ditentukan. Misalnya, mengubah nilai variabel 'greeting' dari 'hello' menjadi 'hello, there!'",
                images: [
                    {
                        url: "/block/text/modif.png",
                        caption: "Contoh penggunaan append text"
                    }
                ]
            },
            {
                title: "Panjang Teks dan Pengecekan Teks Kosong",
                content: "1. Blok 'length of' menghitung jumlah karakter dalam teks\n2. Blok 'is empty' memeriksa apakah teks kosong (memiliki panjang 0)\n\nContoh: Panjang 'We're #1!' adalah 9, dan panjang teks kosong adalah 0.",
                images: [
                    {
                        url: "/block/text/length-empty.png",
                        caption: "Penggunaan length of dan is empty"
                    }
                ]
            },
            {
                title: "Pencarian Teks",
                content: "Blok-blok ini digunakan untuk memeriksa apakah sebuah teks terdapat dalam teks lain dan mencari posisinya. Dapat mencari kemunculan pertama atau terakhir dari sebuah teks.",
                images: [
                    {
                        url: "/block/text/find.png",
                        caption: "Contoh pencarian teks dalam string"
                    }
                ]
            },
            {
                title: "Ekstraksi Teks",
                content: "Terdapat dua jenis ekstraksi teks:\n\n1. Ekstraksi karakter tunggal:\n- Mengambil karakter pada posisi tertentu\n- Mengambil karakter dari akhir\n- Mengambil karakter pertama atau terakhir\n- Mengambil karakter acak\n\n2. Ekstraksi region teks:\n- Mengambil substring dengan berbagai opsi titik awal dan akhir",
                images: [
                    {
                        url: "/block/text/extract-single.png",
                        caption: "Contoh ekstraksi karakter tunggal"
                    },
                    {
                        url: "/block/text/extract-sub.png",
                        caption: "Contoh ekstraksi region teks"
                    }
                ]
            },
            {
                title: "Pengaturan Huruf Besar/Kecil dan Trimming",
                content: "1. Pengaturan huruf:\n- UPPER CASE (semua huruf besar)\n- lower case (semua huruf kecil)\n- Title Case (huruf pertama besar)\n\n2. Trimming spasi:\n- Menghapus spasi di awal teks\n- Menghapus spasi di akhir teks\n- Menghapus spasi di kedua sisi",
                images: [
                    {
                        url: "/block/text/case-trim.png",
                        caption: "Contoh pengaturan case dan trimming"
                    }
                ]
            },
            {
                title: "Mencetak Teks dan Input Pengguna",
                content: "1. Blok 'print' menampilkan nilai input dalam pop-up window\n2. Blok input pengguna:\n- Meminta input teks dari pengguna\n- Meminta input angka dari pengguna\n\nNote: Dalam JavaScript, Python, atau Dart, output akan dicetak ke konsol.",
                images: [
                    {
                        url: "/block/text/print.png",
                        caption: "Contoh penggunaan print"
                    },
                    {
                        url: "/block/text/input.png",
                        caption: "Contoh input pengguna"
                    }
                ]
            }
        ],
    },
    lists: {
        title: "Array (Lists)",
        description: "List dalam Blockly atau yang biasa kita kenal dengan Array adalah kumpulan item yang terurut, mirip dengan daftar belanja atau daftar tugas dalam kehidupan sehari-hari. Item dalam list bisa berupa tipe data apa saja, dan nilai yang sama dapat muncul lebih dari sekali dalam sebuah list.",
        sections: [
            {
                title: "Pembuatan List",
                content: "Ada beberapa cara untuk membuat list:\n\n1. Create empty list: Membuat list kosong\n2. Create list with: Membuat list dengan nilai awal\n  - Dapat berisi teks: ['alpha', 'beta', 'gamma']\n  - Dapat berisi angka: [1, 2, 3]\n  - Dapat berisi warna atau tipe data campuran\n3. Create list with item: Membuat list dengan beberapa salinan item yang sama\n\nJumlah input dapat diubah dengan mengklik ikon roda gigi dan menyeret blok 'item' ke dalam blok list.",
                images: [
                    {
                        url: "/block/array/create.png",
                        caption: "Contoh pembuatan list kosong dan list dengan nilai"
                    },
                    {
                        url: "/block/array/list-item.gif",
                        caption: "Menambah input list menggunakan ikon roda gigi"
                    }
                ]
            },
            {
                title: "Memeriksa Panjang List",
                content: "Ada dua cara untuk memeriksa panjang list:\n\n1. Is empty: Memeriksa apakah list kosong\n2. Length of: Menghitung jumlah item dalam list\n\nNote: Length of menghitung total item, termasuk item yang berulang. Misalnya ['very', 'very', 'very'] memiliki panjang 3.",
                images: [
                    {
                        url: "/block/array/length-empty.png",
                        caption: "Penggunaan is empty dan length of pada list"
                    }
                ]
            },
            {
                title: "Mencari Item dalam List",
                content: "Blok-blok ini mencari posisi item dalam list:\n\n1. Mencari kemunculan pertama item\n2. Mencari kemunculan terakhir item\n3. Mengembalikan 0 jika item tidak ditemukan\n\nMirip dengan pencarian dalam teks.",
                images: [
                    {
                        url: "/block/array/find-item.png",
                        caption: "Contoh pencarian item dalam list"
                    }
                ]
            },
            {
                title: "Mengambil Item dari List",
                content: "Ada beberapa cara untuk mengambil item:\n\n1. Mengambil item tunggal:\n  - Berdasarkan posisi dari awal atau akhir\n  - Mengambil item pertama atau terakhir\n  - Mengambil item secara acak\n\n2. Mengambil dan menghapus item:\n  - Mengambil item sambil menghapusnya dari list\n\n3. Mengambil sublist:\n  - Mengekstrak beberapa item sekaligus\n  - Tidak mengubah list asli",
                images: [
                    {
                        url: "/block/array/get-item.png",
                        caption: "Contoh pengambilan item dari list"
                    }
                ]
            },
            {
                title: "Menambah dan Mengubah Item",
                content: "1. Set: Mengganti item pada posisi tertentu\n2. Insert at: Menyisipkan item baru pada posisi tertentu\n\nContoh:\nList ['very', 'very', 'very'] dapat diubah menjadi:\n1. ['very', 'very', 'good'] menggunakan set\n2. ['You're', 'very', 'very', 'good'] menggunakan insert at",
                images: [
                    {
                        url: "/block/array/insert-item.png",
                        caption: "Contoh penggunaan set dan insert at"
                    }
                ]
            },
            {
                title: "Cetak List",
                content: "1. Print: Dapat mencetak seluruh isi list\n2. For-each: Melakukan operasi pada setiap item dalam list tanpa mengubah list asli",
                images: [
                    {
                        url: "/block/array/print-for-each.png",
                        caption: "Contoh penggunaan print dan for-each dengan list"
                    }
                ]
            }
        ],
    },
    variables: {
        title: "Variabel",
        description: "Variabel dalam Blockly, sama seperti dalam matematika dan bahasa pemrograman lain, adalah nilai bernama yang dapat diubah (bervariasi). Blockly mendukung beberapa jenis variabel termasuk variabel loop, parameter fungsi, dan variabel global.",
        sections: [
            {
                title: "Menu Dropdown Variabel",
                content: "Menu dropdown variabel menyediakan beberapa opsi:\n\n1. Daftar semua variabel yang ada dalam program\n2. 'Rename variable...': Mengubah nama variabel di seluruh program\n3. 'Delete the variable...': Menghapus semua blok yang mereferensikan variabel ini\n\nMenu ini dapat diakses dengan mengklik simbol segitiga pada variabel.",
                images: [
                    {
                        url: "/block/variable/dropdown.png",
                        caption: "Menu dropdown variabel dan opsinya"
                    }
                ]
            },
            {
                title: "Blok Dasar Variabel",
                content: "Terdapat tiga blok dasar untuk memanipulasi variabel:\n\n1. Set: Memberikan nilai ke variabel\n   - Membuat variabel baru jika belum ada\n   - Contoh: set 'age' to 12\n\n2. Get: Mengambil nilai dari variabel\n   - Tidak mengubah nilai variabel\n   - Sebaiknya hanya digunakan setelah variabel di-set\n\n3. Change: Menambahkan angka ke variabel\n   - Shortcut untuk mengambil nilai, menambahkan angka, dan menyimpan kembali\n   - Contoh: change 'age' by 1",
                images: [
                    {
                        url: "/block/variable/set-get-change.png",
                        caption: "Blok set, get, dan change"
                    }
                ]
            },
        ],
    },
    functions: {
        title: "Fungsi (Functions)",
        description: "Fungsi atau prosedur dalam Blockly memungkinkan Anda mendefinisikan serangkaian perintah yang dapat digunakan berulang kali. Fungsi dapat menerima input (parameter) dan mengembalikan nilai (return value), membuat kode lebih terstruktur dan mudah dikelola.",
        sections: [
            {
                title: "Membuat Fungsi",
                content: "Ada dua jenis fungsi yang dapat dibuat:\n\n1. Fungsi tanpa return value:\n- Digunakan untuk menjalankan serangkaian perintah\n- Tidak mengembalikan nilai\n- Berguna untuk tugas-tugas seperti menampilkan pesan atau mengubah nilai variabel\n\n2. Fungsi dengan return value :\n- Menjalankan perhitungan atau operasi\n- Mengembalikan nilai hasil\n- Berguna untuk kalkulasi atau pemrosesan data",
                images: [
                    {
                        url: "/block/function/create.png",
                        caption: "Contoh pembuatan fungsi dengan dan tanpa return value"
                    }
                ]
            },
            {
                title: "Parameter Fungsi",
                content: "Parameter memungkinkan fungsi menerima input:\n\n1. Menambah Parameter:\n- Klik ikon roda gigi pada blok fungsi\n- Tambahkan parameter dengan nama yang deskriptif\n- Parameter dapat bertipe number, text, boolean, atau list\n\n2. Menggunakan Parameter:\n- Parameter dapat diakses di dalam fungsi\n- Nilai parameter ditentukan saat fungsi dipanggil\n- Parameter bersifat lokal dalam fungsi",
                images: [
                    {
                        url: "/block/function/parameter.gif",
                        caption: "Menambah dan menggunakan parameter fungsi"
                    }
                ]
            },
            {
                title: "Memanggil Fungsi",
                content: "Fungsi yang telah dibuat dapat dipanggil dari bagian lain program:\n\n1. Fungsi tanpa parameter:\n- Cukup gunakan blok pemanggilan fungsi\n- Fungsi akan menjalankan semua perintah yang didefinisikan\n\n2. Fungsi dengan parameter:\n- Masukkan nilai untuk setiap parameter\n- Nilai dapat berupa konstanta atau hasil perhitungan\n\n3. Fungsi dengan return value:\n- Hasil fungsi dapat disimpan dalam variabel\n- Dapat digunakan langsung dalam perhitungan atau kondisi",
                images: [
                    {
                        url: "/block/function/call.png",
                        caption: "Contoh pemanggilan berbagai jenis fungsi"
                    }
                ]
            },
            {
                title: "Return Value",
                content: "Untuk fungsi yang mengembalikan nilai:\n\n1. Mengatur Return Value:\n- Gunakan blok return di dalam fungsi\n- Nilai yang dikembalikan dapat berupa:\n  * Hasil perhitungan\n  * Nilai parameter\n  * Nilai variabel\n  * Konstanta\n\n2. Menggunakan Return Value:\n- Simpan dalam variabel\n- Gunakan dalam kondisi\n- Gunakan dalam perhitungan\n- Pass sebagai parameter ke fungsi lain",
                images: [
                    {
                        url: "/block/function/if-return.png",
                        caption: "Penggunaan return value dalam fungsi"
                    }
                ]
            },
        ],
    }
} as const;