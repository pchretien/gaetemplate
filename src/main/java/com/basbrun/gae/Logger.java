package com.basbrun.gae;

public class Logger
{
	private java.util.logging.Logger logger = null;
	
	public Logger(Class<?> type)
	{
		logger = java.util.logging.Logger.getLogger(type.getName());
	}
	
	public void debug(String msg)
	{
		logger.fine(msg);
	}
	
	public void info(String msg)
	{
		logger.info(msg);
	}
	
	public void error(String msg)
	{
		logger.severe(msg);
	}
}
