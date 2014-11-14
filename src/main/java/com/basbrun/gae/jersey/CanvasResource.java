
package com.basbrun.gae.jersey;

import java.io.IOException;
import java.util.Properties;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Multipart;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;
import javax.ws.rs.*;
import javax.ws.rs.core.*;
import javax.xml.bind.DatatypeConverter;

import com.basbrun.gae.Logger;
import com.basbrun.gae.jersey.data.CanvasData;
import com.basbrun.gae.servlets.GaeTemplateServlet;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.Text;


@Path("/canvas")
public class CanvasResource 
{   
	private static Logger logger = new Logger(CanvasResource.class);
	
	@POST
 	@Consumes({ MediaType.APPLICATION_JSON})
    @Produces({ MediaType.APPLICATION_JSON})
 	public CanvasData addDrawing(String canvasAsPng) throws IOException 
	{
		DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
		Entity drawing = new Entity("Drawing");

		drawing.setProperty("png", new Text(canvasAsPng));
		datastore.put(drawing);
		
		long id = drawing.getKey().getId();
		String drawingBase64 = canvasAsPng.replace("data:image/png;base64,", "");
		byte[] dataOut = DatatypeConverter.parseBase64Binary(drawingBase64);
		
		Properties props = new Properties();
        Session session = Session.getDefaultInstance(props, null);

        String msgBody = "Your image <a href=\"http://basbrun-hrd.appspot.com/canvasservlet?key="+id+"\">"+id+"</a>";

        try 
        {
			Message msg = new MimeMessage(session);
			msg.setFrom(new InternetAddress("philippe.chretien@gmail.com", "Drawing - basbrun.com"));
			msg.addRecipient(Message.RecipientType.TO, new InternetAddress("philippechretien@hotmail.com", "Philippe"));
			msg.setSubject("You got a drawing from ...");
			
			//msg.setText(msgBody);
			Multipart mp = new MimeMultipart();

	        MimeBodyPart htmlPart = new MimeBodyPart();
	        htmlPart.setContent(msgBody, "text/html");
	        mp.addBodyPart(htmlPart);

//	        MimeBodyPart attachment = new MimeBodyPart();
//	        attachment.setFileName(id+".png");
//	        attachment.setContent(dataOut, "image/png");
//	        mp.addBodyPart(attachment);
			
	        msg.setContent(mp);
			Transport.send(msg);

        } 
        catch (AddressException e) 
        {
            logger.error(e.getMessage());
        } 
        catch (MessagingException e) 
        {
        	logger.error(e.getMessage());
        }
		
		// Send an email ...
		return new CanvasData(Long.toString(id), drawingBase64);
	}
}
