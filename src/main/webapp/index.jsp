<!doctype html>
	<%@include file='partials/taglib.jsp'%>

<html>
  <head>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8">
    <title>Hello App Engine</title>
    
    <jsp:include page="partials/head.jsp" flush="true"/> 
  </head>

  <body>
  <jsp:include page="partials/menu.jsp" flush="true"/> 

    <h1>Hello App Engine!</h1>
	
    <table>
      <tr>
        <td colspan="2" style="font-weight:bold;">Available Servlets:</td>        
      </tr>
      <tr>
        <td><a href="gaetemplate">GaeTemplate</a></td>
      </tr>
      <tr>
        <td colspan="2" style="font-weight:bold;">Available REST:</td>        
      </tr>
      <tr>
        <td><a href="jersey.jsp">Jersey REST</a></td>
      </tr>
      <tr>
        <td colspan="2" style="font-weight:bold;">Actions:</td>        
      </tr>
      <tr>
        <td><a href="outmailhandler">Send Mail</a></td>
      </tr>
    </table>
    
  <jsp:include page="partials/libs.jsp" flush="true"/> 
  </body>
</html>
