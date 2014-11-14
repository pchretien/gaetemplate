package com.basbrun.gae.jersey.data;

import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class CanvasData
{
	private String uuid;
	private String data;
	
	public CanvasData()
	{
		super();
	}
	
	public CanvasData(String uuid, String data)
	{
		super();
		this.uuid = uuid;
		this.data = data;
	}
	
	public String getUuid()
	{
		return uuid;
	}
	public void setUuid(String uuid)
	{
		this.uuid = uuid;
	}
	public String getData()
	{
		return data;
	}
	public void setData(String data)
	{
		this.data = data;
	}
}
