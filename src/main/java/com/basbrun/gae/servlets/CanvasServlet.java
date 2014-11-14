package com.basbrun.gae.servlets;

import java.io.IOException;
import java.io.OutputStream;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.xml.bind.DatatypeConverter;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.datastore.Text;

public class CanvasServlet extends HttpServlet 
{
	private static final long serialVersionUID = 2490245443964012226L;

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
	{
		String key = request.getParameter("key");
		if(key == null || key.isEmpty())
			return;
		
		DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
		try
		{
			Entity drawing = datastore.get(KeyFactory.createKey("Drawing", Long.parseLong(key)));
			System.out.println(drawing.getProperty("png"));
			
			// Convert from base64 ...
			String drawingBase64;
			Text drawingText = (Text) drawing.getProperty("png");
			if(drawingText == null || drawingText.getValue().length() == 0)
				return;
			
			drawingBase64 = drawingText.getValue().replace("data:image/png;base64,", "");
			
			byte[] dataOut = DatatypeConverter.parseBase64Binary(drawingBase64);
			
			response.setContentType("image/png");
			response.setContentLength(dataOut.length);
			
			OutputStream out = response.getOutputStream();
			out.write(dataOut, 0, dataOut.length);
			out.close();
			
		}
		catch (EntityNotFoundException e)
		{
			e.printStackTrace();
		}
	}
}
