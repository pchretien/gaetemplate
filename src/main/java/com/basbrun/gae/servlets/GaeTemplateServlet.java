package com.basbrun.gae.servlets;

import java.io.IOException;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.basbrun.gae.Logger;

@SuppressWarnings("serial")
public class GaeTemplateServlet extends HttpServlet
{
	private static Logger logger = new Logger(GaeTemplateServlet.class);
	
	public void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws IOException
	{
		resp.setContentType("text/plain");
		resp.getWriter().println("Hello, world");
		
		logger.debug("DEBUG");
		logger.info("INFO");
		logger.error("ERROR");
	}
}
