package com.basbrun.gae.servlets;

import java.io.IOException;
import java.util.Properties;
import java.util.logging.Logger;

import javax.mail.MessagingException;
import javax.mail.Multipart;
import javax.mail.Session;
import javax.mail.internet.MimeMessage;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.appengine.api.mail.MailService;
import com.google.appengine.api.mail.MailService.Message;
import com.google.appengine.api.mail.MailServiceFactory;

public class InMailHandler extends HttpServlet
{
	private static final long serialVersionUID = -1169649708461956431L;
	private final static Logger logger = Logger.getLogger(InMailHandler.class.getName());

	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException
	{
		Properties props = new Properties(); 
        Session session = Session.getDefaultInstance(props, null); 
        
        try
		{
        	// Retreive the MimeMessage from the HTTP Post
			MimeMessage messageIn = new MimeMessage(session, req.getInputStream());
			
			String from = messageIn.getHeader("From", null);
			String subject = messageIn.getHeader("Subject", null);
			
			Multipart multipart = (Multipart) messageIn.getContent();
		    String body = (multipart.getCount()>0)?multipart.getBodyPart(0).getContent().toString():null;
		    
		    logger.info("Received email from (" + from + ") with subject (" + subject + ") and body (" + body.substring(0, 30) + ")");
		    
			Message messageOut = new Message();
			messageOut.setTo(from);
			messageOut.setSender("basbrun.com<philippe.chretien@gmail.com>");			
			messageOut.setSubject("RE: " + subject);
			messageOut.setTextBody(from + "|" + subject +"|" + body + "\nYou sent:\n" + body);			
			MailService mailService = MailServiceFactory.getMailService();
			mailService.send(messageOut);
			
			
		}
		catch (MessagingException e)
		{
			resp.getWriter().println(e.getMessage());
		}
	}
}
