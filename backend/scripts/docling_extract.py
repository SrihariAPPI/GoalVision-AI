#!/usr/bin/env python3
"""
Docling Document Extraction Script
===================================
Extracts text and markdown from PDF, DOCX, TXT, and MD files using IBM Docling.

Usage:
    python docling_extract.py <input_file> [output_format]
    
    output_format: markdown (default) | text | json

Output:
    JSON to stdout with:
    {
        "success": true,
        "markdown": "...",
        "text": "...",
        "pages": 5,
        "metadata": {...}
    }
"""

import sys
import json
import os
from pathlib import Path

def extract_document(file_path: str) -> dict:
    """
    Extract content from document using Docling.
    
    Args:
        file_path: Path to the input document
        
    Returns:
        Dictionary with extraction results
    """
    try:
        from docling.document_converter import DocumentConverter
        from docling.datamodel.base_models import InputFormat
    except ImportError as e:
        return {
            "success": False,
            "error": f"Docling not installed: {e}. Run: pip install docling"
        }
    
    # Validate file exists
    if not os.path.exists(file_path):
        return {
            "success": False,
            "error": f"File not found: {file_path}"
        }
    
    # Get file extension
    ext = Path(file_path).suffix.lower()
    supported_formats = ['.pdf', '.docx', '.txt', '.md']
    
    if ext not in supported_formats:
        return {
            "success": False,
            "error": f"Unsupported format: {ext}. Supported: {supported_formats}"
        }
    
    try:
        # Initialize Docling converter
        converter = DocumentConverter()
        
        # Convert document
        result = converter.convert(file_path)
        
        # Export to markdown
        markdown_content = result.document.export_to_markdown()
        
        # Export to plain text
        text_content = result.document.export_to_text()
        
        # Get page count (for PDF)
        page_count = 1
        if ext == '.pdf':
            try:
                import fitz  # PyMuPDF
                doc = fitz.open(file_path)
                page_count = len(doc)
                doc.close()
            except:
                # Fallback: estimate from markdown headers
                page_count = max(1, markdown_content.count('\n# ') + 1)
        
        # Extract metadata
        metadata = {
            "filename": os.path.basename(file_path),
            "format": ext,
            "size_bytes": os.path.getsize(file_path),
            "char_count": len(text_content),
            "word_count": len(text_content.split()),
        }
        
        return {
            "success": True,
            "markdown": markdown_content,
            "text": text_content,
            "pages": page_count,
            "metadata": metadata
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": f"Docling extraction failed: {str(e)}"
        }


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({
            "success": False,
            "error": "Usage: python docling_extract.py <input_file> [output_format]"
        }))
        sys.exit(1)
    
    input_file = sys.argv[1]
    output_format = sys.argv[2] if len(sys.argv) > 2 else "markdown"
    
    result = extract_document(input_file)
    
    # Output JSON to stdout for Node.js to capture
    print(json.dumps(result, ensure_ascii=False))