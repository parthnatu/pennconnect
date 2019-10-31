<?php
require_once 'common_functions.php';
require_once 'process-requests.php';
?>
<html lang="en">
	<head>
		<!-- Required meta tags -->
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
		<title>PennConnect: User's Profile</title>
		<!-- Bootstrap CSS -->
		<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
		<link href="css/profile.css" rel="stylesheet">	
		<!-- Bootstrap Date-Picker Plugin -->
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.4.1/css/bootstrap-datepicker3.css"/>
	</head>
	<body>
		<header>
			<nav class="navbar navbar-expand-lg fixed-top navbar-dark bg-dark">
				<a class="navbar-brand mr-auto mr-lg-0" href="index.php">PennConnect</a>
				<form class="form-inline">
					<input class="form-control ml-sm-3" type="text" placeholder="Search" aria-label="Search">
				</form>
				<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
					<span class="navbar-toggler-icon"></span>
				</button>
				<div class="navbar-collapse offcanvas-collapse" id="navbarCollapse">
					<ul class="navbar-nav ml-auto">
						<li class="nav-item active">
							<a class="nav-link" href="#">Dashboard <span class="sr-only">(current)</span></a>
						</li>
						<li class="nav-item dropdown active">
							<a class="nav-link dropdown-toggle" href="#" id="dropdown01" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Create</a>
							<div class="dropdown-menu" aria-labelledby="dropdown01">
								<a class="dropdown-item" href="#">Post</a>
								<a class="dropdown-item" href="#">Group</a>
								<a class="dropdown-item" href="#">Event</a>
							</div>
						</li>
						<li class="nav-item active">
							<a class="nav-link" href="#">Profile</a>
						</li>
						<li class="nav-item active">
							<a class="nav-link" href="#">Logout</a>
						</li>		  
					</ul>
				</div>
			</nav>
		</header>
		<div class="container cardContainer">

			<div class="row">
				<div class="col-12">
					<div class="card customCard" id="userCard">
						<?php
							$user_id = $_GET["user_id"];
							if($user_id == "current-user"){
								$user_id = getSessionUserId($_COOKIE['pennconnect']);
							}
							//echo $_COOKIE['pennconnect'];
							$user_details = userDetails($user_id);
						?>
						<div class="card-header text-center">
							<img class="rounded-circle" src="https://randomuser.me/portraits/lego/4.jpg" alt="Card image cap" style="height: 5rem; width: 5rem;" data-holder-rendered="true">
							<h5 class="card-title"><?php echo ucwords($user_details["fname"] . " " . $user_details["lname"]) ?></h5>
							<p class="font-italic" style="font-size: 0.8rem;">Graduate Student at Pennsylvania State university</p>
						</div>
						<!--<div class="card-header">
							<button type="button" class="btn btn-secondary btn-sm">Edit</button>
						</div>-->
						<div class="card-body">
							<div class="d-flex justify-content-between bg-white">
								<div class="card-text font-weight-normal">Connections</div>
								<div class="card-text font-weight-normal" id=""><?php echo $user_details["friend_count"]?></div>

							</div>
							<div>
								<a href="#" class="font-weight-normal">Groups</a><br/>
								<a href="#" class="font-weight-normal">Events</a>
							</div>
						</div>
					</div>
				</div>
			</div>
			<!--<div class="row">
				<div id="profileCards" class="col-12">	
				</div>
			</div>-->
		</div>
		<!-- Optional JavaScript -->
		<!-- jQuery first, then Popper.js, then Bootstrap JS -->
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
		<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
		<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.4.1/js/bootstrap-datepicker.min.js"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.9-1/crypto-js.js"></script>
		<script src="js/profile.js" charset="UTF-8"></script>
	</body>
</html>
