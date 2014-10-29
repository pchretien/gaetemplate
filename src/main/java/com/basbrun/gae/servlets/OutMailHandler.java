package com.basbrun.gae.servlets;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.appengine.api.mail.MailService;
import com.google.appengine.api.mail.MailServiceFactory;
import com.google.appengine.api.mail.MailService.Message;

public class OutMailHandler extends HttpServlet 
{       
	private static final long serialVersionUID = -8110649848547039127L;

	public OutMailHandler() 
    {
        super();
    }

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
	{
		// Using Google APP Engine
		Message message = new Message();
		message.setTo("philippechretien@hotmail.com");
		message.setTextBody("This is a test email");
		message.setSender("basbrun.com<philippe.chretien@gmail.com>");
		message.setSubject("Thant you for your registration");
		MailService mailService = MailServiceFactory.getMailService();
		mailService.send(message);
	}
}
