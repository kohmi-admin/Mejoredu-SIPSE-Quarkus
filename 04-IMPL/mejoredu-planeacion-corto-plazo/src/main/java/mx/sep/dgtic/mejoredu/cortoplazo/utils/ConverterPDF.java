package mx.sep.dgtic.mejoredu.cortoplazo.utils;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

import org.apache.poi.xwpf.converter.pdf.PdfConverter;
import org.apache.poi.xwpf.converter.pdf.PdfOptions;
import org.apache.poi.xwpf.usermodel.XWPFDocument;

public class ConverterPDF {
	public void convertToPDF(String docPath, String pdfPath) {
	      try {
	          //taking input from docx file
	          InputStream doc = new FileInputStream(new File(docPath));
	          //process for creating pdf started
	          XWPFDocument document = new XWPFDocument(doc);
	          PdfOptions options = PdfOptions.create();
	          OutputStream out = new FileOutputStream(new File(pdfPath));
	          PdfConverter.getInstance().convert(document, out, options);
	      } catch (IOException ex) {
	          System.out.println(ex.getMessage());
	      }
	  }
	  
	  public OutputStream convertToPDF(InputStream doc) {
		  OutputStream out = new ByteArrayOutputStream(1024);
	      try {
	          //taking input from docx file
	          //InputStream doc = new FileInputStream(new File(docPath));
	          //process for creating pdf started
	          XWPFDocument document = new XWPFDocument(doc);
	          PdfOptions options = PdfOptions.create();
	          PdfConverter.getInstance().convert(document, out, options);
	          
	      } catch (IOException ex) {
	          System.out.println(ex.getMessage());
	      }
	      return out;
	  }
}
