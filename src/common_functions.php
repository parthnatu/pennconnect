<?php
# Required scripts
#include_path ='.:/usr/share/php';
#require_once ".:/usr/share/php/formvalidator.php";
ini_set('display_errors', 1);
# Global Variables
$servername = "localhost";
$username   = "root";
$password   = "PennConnect@123";
$db         = "pennconnect";

# Commonly Used functions
# Create connection
function createConnection($server_name, $user_name, $passwd, $db) {
	$conn = mysqli_connect($server_name, $user_name, $passwd, $db);
	// Check connection
	if (!$conn) {
		die("Connection failed: " . mysqli_connect_error());
	}
	#echo "Connected successfully<br>";
	return $conn;
}

function closeConnection($conn) {
	mysqli_close($conn);
	#echo "Connection Closed Successfully<br>";
}

function insertInTable($conn, $query) {
	if ($conn->query($query) === TRUE) {
		#echo "New record created successfully!<br>";
		return ('success');
	} else {
		#echo "Error: " . $query . "<br>" . $conn->error;
		return $conn->error;
	}
}

function createNewUser($fname, $lname, $gender, $email, $passwd, $nationality, $date) {
	$new_query = "INSERT INTO user (fname, lname, gender, email, passwd, nationality, dob)
		      VALUES('$fname', '$lname', '$gender', '$email', '$passwd', '$nationality', '$date')";
	#echo "Query: $new_query\n";
	global $servername, $username, $password, $db;
	$connID = createConnection($servername, $username, $password, $db);
	$ret = insertInTable($connID, $new_query);
	closeConnection($connID);
	return $ret;
}

function getUsers($connID) {
	#TEST FUNCTION
	$new_query = "SELECT * FROM user WHERE user_id<10";
	$result = $connID->query($new_query);
	return $result;
}

function showExistingUsers() {
	global $servername, $username, $password, $db;
	$connID = createConnection($servername, $username, $password, $db);
	$resp = getUsers($connID);
	closeConnection($connID);
	return $resp;
}

function getUserIdFromEmail($email){
	global $servername, $username, $password, $db;
	$connID = createConnection($servername, $username, $password, $db);
	$query = "SELECT user_id FROM user WHERE email='$email'";
	$result = $connID->query($query);
	if($result->num_rows > 0){
		$row = mysqli_fetch_assoc($result);
		
		$user_id = $row["user_id"];
	}
	else{
		$user_id = -1;
	}
	closeConnection($connID);
	return $user_id;
}
function checkPassword($email, $hashed_password){
	global $servername, $username, $password, $db;
        $connID = createConnection($servername, $username, $password, $db);
	$query = "SELECT * FROM user WHERE email='$email' and passwd='$hashed_password'";
	$result = $connID->query($query);
	if($result->num_rows > 0){
		closeConnection($connID);
		return True;
	}
	else{
		closeConnection($connID);
		return False;
	}
}

function loginUser($user_id){
	global $servername, $username, $password, $db;
	$connID = createConnection($servername, $username, $password, $db);
	$uuid_query = 'SELECT UUID()';
	$result = $connID->query($uuid_query);
	$row = mysqli_fetch_assoc($result);
	$uuid = $row['UUID()'];
	$query = "INSERT INTO session(user_id,session_token) VALUES('$user_id','$uuid')";
	if($connID->query($query) === TRUE){
		closeConnection($connID);
		return $uuid;
	}
	else{
		echo $connID->error;
		closeConnection($connID);
		return -1;
	}

}

function logoutUser($session_token){
	global $servername, $username, $password, $db;
	$connID = createConnection($servername, $username, $password, $db);
	$query = "DELETE FROM session WHERE session_token='$session_token'";
	if($connID->query($query) === TRUE){
		closeConnection($connID);
		return 'success';
	}
	else{
		closeConnection($connID);
		return $connID->error;
	}
}
#echo "Exiting....<br>";
?>
