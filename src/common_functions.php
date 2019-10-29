<?php
require_once 'vendor/autoload.php';

use GraphAware\Neo4j\Client\ClientBuilder;
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
		header("HTTP/1.1 200 OK");
		return ('success');
	} else {
		#echo "Error: " . $query . "<br>" . $conn->error;
		header("HTTP/1.1 401 Unauthorized");
		return $conn->error;
	}
}

function createNewUser($fname, $lname, $gender, $email, $passwd, $nationality, $date) {
	$hashed_passwd = sha1($passwd);
	$client = ClientBuilder::create()
                ->addConnection('bolt', 'bolt://neo4j:pennconnect@localhost:7687')
		->build();	
	$new_query = "INSERT INTO user (fname, lname, gender, email, passwd, nationality, dob)
		      VALUES('$fname', '$lname', '$gender', '$email', '$hashed_passwd', '$nationality', '$date')";
	global $servername, $username, $password, $db;
	$get_new_id= "SELECT AUTO_INCREMENT FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA='pennconnect' AND TABLE_NAME='user'";
	$connID = createConnection($servername, $username, $password, $db);
	$id_result = $connID->query($get_new_id);
	$row = mysqli_fetch_assoc($id_result);
	$new_id = $row["AUTO_INCREMENT"];
	$client->run("CREATE (:User {user_graph_id: \"$new_id\"})");
	$ret = insertInTable($connID, $new_query);
	closeConnection($connID);
	return $ret;
}

function getUserSessionToken($user_id){
	global $servername, $username, $password, $db;
	$connID = createConnection($servername, $username, $password, $db);
	$query = "SELECT session_token FROM session WHERE user_id='$user_id'";
	$result = $connID->query($query);
	if($result->num_rows > 0){
		$row = mysqli_fetch_assoc($result);

		$session_token = $row["session_token"];
	}
	else{
		$session_token = -1;
	}
	closeConnection($connID);
	return $session_token;
}

function getUserDetails($userID) {
	global $servername, $username, $password, $db;
	$connID = createConnection($servername, $username, $password, $db);
	$new_query = "SELECT fname,lname,gender,email,nationality,dob,friend_count FROM user WHERE user_id='$userID'";
	$result = $connID->query($new_query);
	if($result->num_rows > 0) {
                $fetchedRow = mysqli_fetch_assoc($result);
	}
	else{
		return -1;
	}
	closeConnection($connID);
	return $fetchedRow;
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

function getUserID($connID, $sessionToken) {
	$new_query = "SELECT user_id FROM session WHERE session_token='$sessionToken'";
	$result = $connID->query($new_query);
	if($result->num_rows > 0) {
		#We have a valid user!!
		$fetchedRow = mysqli_fetch_assoc($result);
		$userID = $fetchedRow['user_id'];
	}
	else {
		#invalid user
		$userID = -1;
	}
	return $userID;
}

function getSessionUserId($sessionToken) {
	global $servername, $username, $password, $db;
	$connID = createConnection($servername, $username, $password, $db);
	$userID = getUserID($connID, $sessionToken);
	closeConnection($connID);
	return $userID;
}

function insertPost($user_id, $post_type, $text,  $timestamp) {
	global $servername, $username, $password, $db;
	$new_query = "INSERT INTO posts (user_id, post_type,text, media_url, timestamp, upvotes, downvotes)
		      VALUES('$user_id', '$post_type', '$text', '', '$timestamp', '0', '0')";
	$connID = createConnection($servername, $username, $password, $db);
	$ret = insertInTable($connID, $new_query);
	closeConnection($connID);
	return $ret;
}

function insertComment($user_id, $post_id, $text, $timestamp, $date) {
	global $servername, $username, $password, $db;
	$new_query = "INSERT INTO comments (user_id, post_id,text,timestamp,date)
		      VALUES('$user_id', '$post_id', '$text', '$timestamp', '$date')";
	$connID = createConnection($servername, $username, $password, $db);
	$ret = insertInTable($connID, $new_query);
	closeConnection($connID);
	return $ret;
}

function getUserFriends($user_id){
	$client = ClientBuilder::create()
    		->addConnection('bolt', 'bolt://neo4j:pennconnect@localhost:7687')
		->build();
	$query = "MATCH (n:User {user_graph_id: \"$user_id\"})-[:IS_FRIEND_OF]-(f:User) RETURN f.user_graph_id";
	$result = $client->run($query);
	$friends_id_list = array();
	foreach($result->getRecords() as $record){
		array_push($friends_id_list,$record->value("f.user_graph_id"));
	}
	return $friends_id_list;
}

function getUserPosts($user_id){
	global $servername, $username, $password, $db;
        $query = "SELECT post_id FROM posts where user_id=$user_id";
        $connID = createConnection($servername, $username, $password, $db);
	$posts = array();
	$result = $connID->query($query);
	while($r = mysqli_fetch_assoc($result)) {
                $posts[] = $r['post_id'];
	}
	closeConnection($connID);
        return $posts;
}

function getPostfromId($post_id){
	global $servername, $username, $password, $db;
        $query = "SELECT post_type,user.user_id,text,media_url,upvotes,downvotes,fname,lname,timestamp FROM posts JOIN user ON posts.user_id = user.user_id WHERE posts.post_id =$post_id";
	$connID = createConnection($servername, $username, $password, $db);
	$result = $connID->query($query);
	if($result->num_rows > 0) {
		$post = mysqli_fetch_assoc($result);
	}
	else{
		return -1;
	}
	return $post;
}
#echo "Exiting....<br>";
?>
