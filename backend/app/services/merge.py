from PyPDF2 import PdfMerger

def merge_pdfs(file_paths, output_path):
    merger = PdfMerger()
    for path in file_paths:
        merger.append(path)
    merger.write(output_path)
    merger.close()