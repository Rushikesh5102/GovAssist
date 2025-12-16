
import os

SOURCE_DIR = r"c:\Users\Rushi\Desktop\GovAssist\frontend\src"

def find_unused_files(directory):
    all_files = []
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(('.js', '.jsx', '.ts', '.tsx', '.css')):
                all_files.append(os.path.join(root, file))

    print(f"Total files: {len(all_files)}")
    
    unused = []
    for file_path in all_files:
        basename = os.path.basename(file_path)
        name_no_ext = os.path.splitext(basename)[0]
        
        # Skip index files, they are usually folders' entries
        if name_no_ext == 'index':
            continue
            
        found = False
        # Search in all files
        for search_file in all_files:
            if search_file == file_path:
                continue
            
            try:
                with open(search_file, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()
                    # Naive check: if filename (without ext) appears in content
                    if name_no_ext in content:
                        found = True
                        break
            except Exception as e:
                print(f"Error reading {search_file}: {e}")
        
        if not found:
            unused.append(file_path)

    print("\nPotentially Unused Files:")
    for u in unused:
        print(u)

if __name__ == "__main__":
    find_unused_files(SOURCE_DIR)
