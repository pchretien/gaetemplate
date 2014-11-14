<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
	<title>Insert title here</title>
	
	<jsp:include page="partials/libs.jsp" flush="true"/> 
	<link href="static/css/canvas.css" rel="stylesheet"> 
</head>
<body>
	<canvas id="c" width="500" height="300"></canvas><br>
	<button id="send">Send me a drawing</button>

	<script>
		var el = document.getElementById('c');
		var ctx = el.getContext('2d');
		var isDrawing;
		
		el.onmousedown = function(e) {
		  isDrawing = true;
		  ctx.moveTo(e.clientX, e.clientY);
		};
		
		el.onmousemove = function(e) {
		  if (isDrawing) {
		    ctx.lineTo(e.clientX, e.clientY);
		    ctx.stroke();
		  }
		};
		
		el.onmouseup = function() {
		  isDrawing = false;
		};
		
		$('#send').click(sendDrawing);
		
		function sendDrawing()
		{
			var canvasData = $('#c')[0].toDataURL("image/png");

			$.ajax({
				type: "POST",
				cache:false,
				url: encodeURI("jersey/canvas"),
				contentType: "application/json; charset=utf-8",
				dataType: "json",
				data: canvasData,
				success: function(id) 
				{
					window.location.replace('/canvasservlet?key='+id.uuid);
				},
				error: function(e)
				{
					alert("error");
				}
		   	});
		}
		
	</script>
</body>
</html>