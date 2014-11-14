<%@include file='taglib.jsp'%>

	<!-- Fixed navbar -->
	<div class="navbar navbar-default navbar-fixed-top" role="navigation">
		<div class="container">
			<div class="navbar-header">
				<button type="button" class="navbar-toggle collapsed"
					data-toggle="collapse" data-target=".navbar-collapse">
					<span class="sr-only">Toggle navigation</span> <span class="icon-bar"></span> 
					<span class="icon-bar"></span> <span class="icon-bar"></span>
				</button>
				<a class="navbar-brand" href="index.html"><img src="static/img/logo.png" height="50px" style="display:inline;margin-top:-16px"/></a>
			</div>
			<sec:authorize var="loggedIn" access="isAuthenticated()" />
			
			<c:choose>
			<c:when test="${loggedIn}">

				<div class="navbar-collapse collapse">
					<ul class="nav navbar-nav">
						<li class="active"><a href="dashboard.jsp">Dashboard</a></li>
						<li><a href="newcall.jsp#/0/0/">New Call</a></li>
					</ul>
					<ul class="nav navbar-nav navbar-right">
						<li><a href="#contact">My Account</a></li>
						<li class="dropdown"><a href="#" class="dropdown-toggle" >Menu <span class="caret"></span></a>
							<ul class="dropdown-menu" role="menu">
								<li><a href="#">Tasks</a></li>
								<li><a href="project.jsp#/">Projects</a></li>
								<li><a href="client.jsp#/">Clients</a></li>
								<li><a href="timesheet.jsp#/">Timesheets</a></li>
								<li><a href="#">Users</a></li>
								<li><a href="j_spring_security_logout">Logout</a></li>
							</ul>
						</li>
					</ul>
				</div>
			 </c:when>
    		<c:otherwise>
				<div class="navbar-collapse collapse">
					<ul class="nav navbar-nav">
						
					</ul>
					<ul class="nav navbar-nav navbar-right">
						<li><a href="">Sign in</a></li>
						<li><a href="">New Account</a></li>						
					</ul>
				</div>
			</c:otherwise>
			</c:choose>
			<!--/.nav-collapse -->
		</div>
	</div>
