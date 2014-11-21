<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
	<title>Insert title here</title>
	
	<jsp:include page="partials/libs.jsp" flush="true"/> 
	<link href="static/css/canvas.css" rel="stylesheet"> 
	
	<link href="static/css/drawingboard.css" rel="stylesheet">
	
	<script src="static/js/drawingboard.js"></script>
	<script src="static/js/board.js"></script>
	<script src="static/js/controls/control.js"></script>
	<script src="static/js/controls/color.js"></script>
	<script src="static/js/controls/drawingmode.js"></script>
	<script src="static/js/controls/navigation.js"></script>
	<script src="static/js/controls/size.js"></script>
	<script src="static/js/controls/download.js"></script>
	<script src="static/js/utils.js"></script>
	
	<style>
		/*
		* drawingboards styles: set the board dimensions you want with CSS
		*/

		.board {
			margin: 0 auto;
			width: 300px;
			height: 300px;
		}

		#default-board {
			width: 700px;
			height: 400px;
		}

		#custom-board-2 {
			width: 550px;
			height: 300px;
		}

		#title-board {
			width: 600px;
			height: 270px;
		}
		/* custom board styles for the title? no problem*/
		#title-board .drawing-board-canvas-wrapper {
			border: none;
			margin: 0;
		}
		</style>
</head>
<body>
	<div class="example" data-example="1">
		<div id="default-board"></div><br>
		<button id="send">Envoyez votre dessin à Gabrielle ... :)</button>
	</div>
	
	<script data-example="1">
		//create the drawingboard by passing it the #id of the wanted container
		var defaultBoard = new DrawingBoard.Board('default-board');
	</script>

	<script>		
	
		$('#send').click(sendDrawing);
		
		function sendDrawing()
		{
			//var canvasData = $('#c')[0].toDataURL("image/png");
			var canvasData = $('.drawing-board-canvas')[0].toDataURL("image/png");

			$.ajax({
				type: "PUT",
				cache:false,
				url: encodeURI("jersey/canvas/2"),
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