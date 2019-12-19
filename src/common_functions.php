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
		#echo "Got an Error: " . $query . "<br>" . $conn->error;
		header("HTTP/1.1 401 Unauthorized");
		return $conn->error;
	}
}

function createNewUser($fname, $lname, $gender, $email, $passwd, $nationality, $date, $major, $degree_type, $graduation_year) {
	$hashed_passwd = sha1($passwd);
	$client = ClientBuilder::create()
                ->addConnection('bolt', 'bolt://neo4j:pennconnect@localhost:7687')
		->build();	
	$new_query = "INSERT INTO user (fname, lname, gender, email, passwd, nationality, dob, major, degree_type, graduation_year, friend_count)
		      VALUES('$fname', '$lname', '$gender', '$email', '$hashed_passwd', '$nationality', '$date','$major','$degree_type','$graduation_year',0)";
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

function _getGroupDetails($group_id,$user_id){
	global $servername, $username, $password, $db;
	$connID = createConnection($servername, $username, $password, $db);
	$query = "SELECT * FROM group_users WHERE group_id=$group_id AND member_user_id=$user_id";
	$member_flag = false;
	$result = $connID->query($query);
	if($result->num_rows > 0){
		$member_flag = true;
	}
	$query = "SELECT group_id, group_name, member_count FROM groups where group_id=$group_id";
	$result = $connID->query($query);
	if($result->num_rows > 0){
		$row = mysqli_fetch_assoc($result);
		$row['is_member'] = $member_flag;
		return $row;
	}
	else{
		return -1;
	}
}
function getFriendStatus($user_id,$friend_user_id){
	$client = ClientBuilder::create()
    		->addConnection('bolt', 'bolt://neo4j:pennconnect@localhost:7687')
		->build();
	$query = "MATCH n=(:User {user_graph_id: \"$user_id\"})-[:IS_FRIEND_OF]-(f:User {user_graph_id: \"$friend_user_id\"}) RETURN count(n) > 0";
	$result = $client->run($query);
	return $result->firstRecord()->get("count(n) > 0");
}

function changeFriendStatus($flag,$user_id,$friend_user_id){
	$client = ClientBuilder::create()
    		->addConnection('bolt', 'bolt://neo4j:pennconnect@localhost:7687')
		->build();
	global $servername, $username, $password, $db;
        $connID = createConnection($servername, $username, $password, $db);
	if($flag){
		$query = "MATCH (a:User),(b:User) WHERE a.user_graph_id=\"$user_id\" AND b.user_graph_id=\"$friend_user_id\" CREATE (a)-[r:IS_FRIEND_OF]->(b) RETURN r";
		$result = $client->run($query);
		$increase_friend_count_query = "UPDATE user SET friend_count = friend_count + 1 WHERE user_id=$user_id OR user_id=$friend_user_id";
		$connID->query($increase_friend_count_query);
		if(mysqli_affected_rows($connID) >= 0){
			closeConnection($connID);
			return ($result->firstRecord()->get("r") !== NULL);	
		}
		else{
			closeConnection($connID);
			return false;
		}
	}
	else{
		$query = "MATCH n=(:User {user_graph_id: \"$user_id\"})-[r:IS_FRIEND_OF]-(f:User {user_graph_id: \"$friend_user_id\"}) DELETE r";
		$result = $client->run($query);
		$reduce_friend_count_query = "UPDATE user SET friend_count = friend_count - 1 WHERE user_id=$user_id OR user_id=$friend_user_id AND friend_count > 0";
                $connID->query($reduce_friend_count_query);
                if(mysqli_affected_rows($connID) >= 0){
                        closeConnection($connID);
                        return true;
                }
                else{
                        closeConnection($connID);
                        return false;
                }

		return true;
	}
}
function getUserDetails($userID) {
	global $servername, $username, $password, $db;
	$connID = createConnection($servername, $username, $password, $db);
	$new_query = "SELECT fname,lname,gender,email,nationality,dob,friend_count,major,degree_type,graduation_year,group_count FROM user WHERE user_id='$userID'";
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

function _getGroupDetailsForUser($user_id){
	global $servername, $username, $password, $db;
	$connID = createConnection($servername, $username, $password, $db);
	$query = "";
	$query .= "SELECT groups.group_id, ";
	$query .= "       group_name, ";
	$query .= "       group_creator_user_id, ";
	$query .= "       Concat(Concat(Ucase(LEFT(fname, 1)), Substring(fname, 2)), \" \", ";
	$query .= "       Concat(Ucase(LEFT(lname, 1)), Substring(lname, 2))) admin_name, ";
	$query .= "       created_on ";
	$query .= "FROM   groups ";
	$query .= "       JOIN group_users ";
	$query .= "         ON groups.group_id = group_users.group_id ";
	$query .= "       JOIN user ";
	$query .= "         ON groups.group_creator_user_id = user.user_id ";
	$query .= "WHERE  group_users.member_user_id = $user_id" ;
	$result = $connID->query($query);
	$rows = array();
	while($r = mysqli_fetch_assoc($result)) {
		$rows[] = $r;
	}
	closeConnection($connID);
	return $rows;
}

function _getAnalytics(){
	global $servername, $username, $password, $db;
	$connID = createConnection($servername, $username, $password, $db);
	$query_num_users_nat = "SELECT COUNT(*) count,nationality FROM user WHERE nationality != '' GROUP BY nationality";
	$num_users_nat = array();
	$user_post_count = array();
	$output = array();
	$query_num_sessions = "SELECT COUNT(*) count FROM session";
	$query_num_users = "SELECT COUNT(*) count FROM user";
	$result = $connID->query($query_num_sessions); 
	if($result->num_rows > 0) {
                $num_sessions = mysqli_fetch_assoc($result);
	}
	$result = $connID->query($query_num_users);
	if($result->num_rows > 0) {
                $num_users = mysqli_fetch_assoc($result);
	}
	$result = $connID->query($query_num_users_nat);
	while($r = mysqli_fetch_assoc($result)) {
		$nationality = $r['nationality'];
		$data = json_decode(file_get_contents("https://restcountries.eu/rest/v2/alpha/$nationality?fields=latlng;name"),true);
		$r["latlng"] = $data["latlng"];
		$r["natname"] = $data["name"];
		$num_users_nat[] = $r;
	}
	$query_post_count = "SELECT user.user_id,CONCAT(CONCAT(UCASE(LEFT(fname, 1)), SUBSTRING(fname, 2)),\" \",CONCAT(UCASE(LEFT(lname, 1)), SUBSTRING(lname, 2))) name,t1.cnt FROM user JOIN (SELECT user_id,count(*) cnt FROM posts GROUP BY user_id ORDER BY COUNT(*) DESC LIMIT 10) t1 ON t1.user_id = user.user_id";
	$result = $connID->query($query_post_count);
	while($r = mysqli_fetch_assoc($result)) {
		$user_post_count[] = $r;
	}
	$output["nat_num"] = $num_users_nat;
	$output["num_sessions"] = $num_sessions;
	$output["num_users"] = $num_users;
	$output["user_post_count"] = $user_post_count;
	return $output; 
	

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

function insertPost($user_id, $post_type, $text,  $timestamp, $media_url) {
	global $servername, $username, $password, $db;
	$new_query = "INSERT INTO posts (user_id, post_type,text, media_url, timestamp, upvotes, downvotes)
		      VALUES('$user_id', '$post_type', '$text', '$media_url', '$timestamp', '0', '0')";
	$connID = createConnection($servername, $username, $password, $db);
	$ret = insertInTable($connID, $new_query);

	if ($ret == 'success') {
		#On success return the post details
		#This is what Soundarya wants
		$last_id = mysqli_insert_id($connID);
		$query = "select fname, lname, post_id, post_type,text, 
			media_url, upvotes, downvotes, timestamp from posts, 
			user where post_id='$last_id' and 
			posts.user_id=user.user_id";
		$res = $connID->query($query);
		if($res->num_rows > 0) {
			$post_details = mysqli_fetch_assoc($res);
			return $post_details;
		}
		
	}
	closeConnection($connID);
	return $ret;
}

function insertComment($user_id, $post_id, $text, $timestamp) {
	global $servername, $username, $password, $db;
	$new_query = "INSERT INTO comments (user_id, post_id,text,timestamp)
		      VALUES('$user_id', '$post_id', '$text', '$timestamp')";
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

function getCommentIDs($postID) {
	global $servername, $username, $password, $db;
	$query = "SELECT comment_id FROM comments where post_id=$postID";
	$connID = createConnection($servername, $username, $password, $db);
	$comments = array();
	$result = $connID->query($query);
	while($r = mysqli_fetch_assoc($result)) {
		$comments[] = $r['comment_id'];
	}
	closeConnection($connID);
	return $comments;
}

function getEventFromSearchString($searchStr) {
	global $servername, $username, $password, $db;
	$events = array();
	$query = "SELECT * FROM events WHERE event_name LIKE '%$searchStr%'";
	$connID = createConnection($servername, $username, $password, $db);
	$result = $connID->query($query);
	if($result->num_rows > 0) {
		while($event = mysqli_fetch_assoc($result)) {
			$event['object_type'] = "event";
			array_push($events, $event);
		}
	}
	else{
		return -1;
	}
	return $events;
}

function getGroupFromSearchString($searchStr) {
	global $servername, $username, $password, $db;
	$groups = array();
	$query = "SELECT * FROM groups WHERE group_name LIKE '%$searchStr%'";
	$connID = createConnection($servername, $username, $password, $db);
	$result = $connID->query($query);
	if($result->num_rows > 0) {
		while($group = mysqli_fetch_assoc($result)) {
			$group['object_type'] = "group";
			array_push($groups, $group);
		}
	}
	else{
		return -1;
	}
	return $groups;
}

function getUserFromSearchString($searchStr) {
	global $servername, $username, $password, $db;
	$users = array();
	$query = "SELECT user_id,fname,lname,gender,email,nationality,dob,major,degree_type,graduation_year,friend_count FROM user WHERE CONCAT(fname, ' ', lname) LIKE '%$searchStr%'";
	$connID = createConnection($servername, $username, $password, $db);
	$result = $connID->query($query);
	if($result->num_rows > 0) {
		while($user = mysqli_fetch_assoc($result)) {
			$user['object_type'] = "user";
			array_push($users, $user);
		}
	}
	else{
		return -1;
	}
	return $users;
}

function getCommentFromId($post_id){
	global $servername, $username, $password, $db;
        $query = "SELECT fname,lname,post_id, comment_id,text,timestamp FROM comments,user WHERE comments.user_id=user.user_id AND post_id =$post_id ORDER BY timestamp DESC";
	$connID = createConnection($servername, $username, $password, $db);
	$result = $connID->query($query);
	$comments = array();
	if($result->num_rows > 0) {
		while($comment = mysqli_fetch_assoc($result)) {
			array_push($comments, $comment);
		}
	}
	else{
		return -1;
	}
	return $comments;
}

function editProfileAttribute ($userID, $attributes, $values) {
	global $servername, $username, $password, $db;
	if (count($attributes) != count($values)) {
		#mismatched input
		return null;
	} else {
		$query = "UPDATE user SET ";
		$ii = 0;
		foreach ($attributes as $attribute) { 
			if ($ii != 0) {
				$temp = ", $attribute='$values[$ii]'";
			} else {
				$temp = "$attribute='$values[$ii]'";
			}
			$query = "{$query}{$temp}";	
			$ii += 1;
		}
		$temp = " WHERE user_id=$userID";
		$query = "{$query}{$temp}";

		$connID = createConnection($servername, $username, $password, $db);
		$ret = insertInTable($connID, $query);
		closeConnection($connID);
		return $ret;
	}
}

function editPostAttribute($postID, $attributes, $values,$postType) {
	global $servername, $username, $password, $db;
	if (count($attributes) != count($values)) {
		#mismatched input
		return null;
	} else {
		if($postType){
			$query = "UPDATE posts SET ";
			$ii = 0;
			foreach ($attributes as $attribute) { 
				if ($ii != 0) {
					$temp = ", $attribute='$values[$ii]'";
				} else {
					$temp = "$attribute='$values[$ii]'";
				}
				$query = "{$query}{$temp}";	
				$ii += 1;
			}
			$temp = " WHERE post_id=$postID";
			$query = "{$query}{$temp}";

			$connID = createConnection($servername, $username, $password, $db);
			$ret = insertInTable($connID, $query);
			closeConnection($connID);
			return $ret;
		}
		else{
			$query = "UPDATE group_posts SET ";
			$ii = 0;
			foreach ($attributes as $attribute) { 
				if ($ii != 0) {
					$temp = ", $attribute=$values[$ii]";
				} else {
					$temp = "$attribute=$values[$ii]";
				}
				$query = "{$query}{$temp}";	
				$ii += 1;
			}
			$temp = " WHERE post_id=$postID";
			$query = "{$query}{$temp}";

			$connID = createConnection($servername, $username, $password, $db);
			$ret = insertInTable($connID, $query);
			closeConnection($connID);
			return $ret;
		}
	}
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

function getPostFromId($post_id,$type_flag){
	global $servername, $username, $password, $db;
	if($type_flag){
		$query = "SELECT group_posts.post_id,post_type,user.user_id,text,media_url,upvotes,downvotes,fname,lname,timestamp FROM group_posts JOIN user ON group_posts.user_id = user.user_id WHERE group_posts.post_id =$post_id";
	}
	else{
		$query = "SELECT posts.post_id,post_type,user.user_id,text,media_url,upvotes,downvotes,fname,lname,timestamp FROM posts JOIN user ON posts.user_id = user.user_id WHERE posts.post_id =$post_id";
	}
	$connID = createConnection($servername, $username, $password, $db);
	$result = $connID->query($query);
	if($result->num_rows > 0) {
		$post = mysqli_fetch_assoc($result);
	}
	else{
		closeConnection($connID);
		return -1;
	}
	closeConnection($connID);
	return $post;
}

function deleteEventAsAdmin($eventID, $userID) {
	global $servername, $username, $password, $db;
	$connID = createConnection($servername, $username, $password, $db);
	$query = "DELETE FROM events WHERE event_id = '$eventID' 
		AND event_created_user_id = '$userID'";
	$result = $connID->query($query);
	if($result) {
		closeConnection($connID);
		return 'success';
	} else {
		closeConnection($connID);
		return null;
	}
}

function createNewEvent($eventName, $userID) {
	global $servername, $username, $password, $db;
	$connID = createConnection($servername, $username, $password, $db);
	$query = "INSERT INTO events (event_name, event_created_user_id) 
		VALUES('$eventName', '$userID')";
	$result = $connID->query($query);
	if($result) {
		closeConnection($connID);
		return 'success';
	} else {
		closeConnection($connID);
		return null;
	}
}

function getUserEventListFromID($user_id) {
	global $servername, $username, $password, $db;
	$events = array();
	$connID = createConnection($servername, $username, $password, $db);
	#$query1 = "SELECT * FROM event_users 
	#WHERE member_user_id='$user_id'";
	$query1 = "SELECT * FROM event_users INNER JOIN events ON 
		event_users.event_id=events.event_id WHERE 
		event_users.member_user_id='$user_id'";
	$query2 = "SELECT * FROM events 
		WHERE event_created_user_id='$user_id'";
	$result1 = $connID->query($query1);
	if($result1->num_rows > 0) {
		while($event = mysqli_fetch_assoc($result1)) {
			array_push($events, $event);
		}
	} 

	$result2 = $connID->query($query2);
	if($result2->num_rows > 0) {
		while($event = mysqli_fetch_assoc($result2)) {
			$event['member_user_id'] = "$user_id";
			$event['status'] = "creator";
			array_push($events, $event);
		}
	}
	
	closeConnection($connID);
	return ($events);
}

function isUserInEvent($userID, $eventID) {
	global $servername, $username, $password, $db;
	$events = array();
	$connID = createConnection($servername, $username, $password, $db);
	$ret = array();
	$ret['is_member'] = 0;

	$query = "SELECT status FROM event_users 
		WHERE event_id='$eventID' and 
		member_user_id='$userID'";
	$result = $connID->query($query);
	if($result->num_rows > 0) {
		$res = mysqli_fetch_assoc($result);
		$ret['is_member'] = 'yes';
		$ret['status'] = $res['status'];
	} else {
		$ret['is_member'] = 'no';
	}
	closeConnection($connID);
	return($ret);
}

function getEventFromID($eventIDs, $user_id) {
	global $servername, $username, $password, $db;
	$events = array();
	$connID = createConnection($servername, $username, $password, $db);

	foreach($eventIDs as $event_id){
		$query = "SELECT * FROM events WHERE event_id='$event_id'";
		$result = $connID->query($query);
		if($result->num_rows > 0) {
			$event = mysqli_fetch_assoc($result);
			if ($event['event_created_user_id'] == $user_id) {
				$event['is_member'] = 'yes'; 
				$event['status'] = 'creator';
			} else {
				$res = array();
				$res = isUserInEvent($user_id, $event_id);
				$event['is_member'] = $res['is_member'];
			       	if (isset($res['status']))
					$event['status'] = $res['status'];
			}
			array_push($events, $event);
		} else {
			#Event was not found
			continue;
		}
	}
	closeConnection($connID);
	return ($events);
}

function addSubscription ($eventID, $userID, $subscriptionStatus) {
	global $servername, $username, $password, $db;
	$connID = createConnection($servername, $username, $password, $db);
	$query1 = "INSERT INTO event_users (event_id, member_user_id, status) 
		VALUES('$eventID', '$userID', '$subscriptionStatus')";
	$result1 = $connID->query($query1);

	$query2 = "UPDATE events SET event_member_count=event_member_count+1
		WHERE event_id = '$eventID'";
	$result2 = $connID->query($query2);

	if($result1 && $result2) {
		closeConnection($connID);
		return 'success';
	} else {
		closeConnection($connID);
		return null;
	}
}

function cancelSubscription($eventID, $userID) {
	global $servername, $username, $password, $db;
	$connID = createConnection($servername, $username, $password, $db);
	$query1 = "DELETE FROM event_users WHERE event_id = '$eventID' AND  
				member_user_id = '$userID'";
	$result1 = $connID->query($query1);

	$query2 = "UPDATE events SET event_member_count=event_member_count-1
		WHERE event_id = '$eventID'";
	$result2 = $connID->query($query2);

	if($result1 && $result2) {
		closeConnection($connID);
		return 'success';
	} else {
		closeConnection($connID);
		return null;
	}
}

function updateSubscription ($eventID, $userID, $subscriptionStatus) {
	global $servername, $username, $password, $db;
	$connID = createConnection($servername, $username, $password, $db);
	$query = "UPDATE event_users SET status = '$subscriptionStatus' 
		WHERE event_id = '$eventID' AND  member_user_id = '$userID'";
	$result = $connID->query($query);
	if($result) {
		closeConnection($connID);
		return 'success';
	} else {
		closeConnection($connID);
		return null;
	}
}

function manageEventSubscription ($eventID, $userID, $subscriptionStatus) {
	global $servername, $username, $password, $db;
	$connID = createConnection($servername, $username, $password, $db);
	$query = "SELECT * FROM event_users WHERE event_id = '$eventID' 
		AND member_user_id = '$userID'";
	$result = $connID->query($query);
	closeConnection($connID);
	if($result->num_rows > 0) {
		#Entry already exists for this user.
		#So either update or cancel the current subscription.
		if ($subscriptionStatus == 'cancel') {
			return(cancelSubscription($eventID, 
				$userID, $subscriptionStatus));
		} else {
			return(updateSubscription($eventID,
				$userID, $subscriptionStatus));
		}
	} else {
		if ($subscriptionStatus == 'cancel') {
			#Already cancelled, do nothing
			return "success";
		} else {
			#No existing entry for this user and event.
			#So create a new entry
			return (addSubscription($eventID, 
				$userID, $subscriptionStatus));
		}
	}	
}

function getEventParticipantsFromID($eventID) {
	global $servername, $username, $password, $db;
	$members = array();
	$connID = createConnection($servername, $username, $password, $db);
	$query = "SELECT member_user_id, status, fname, lname, gender, email FROM event_users, user WHERE event_id='$eventID' AND user_id=member_user_id";
	$result = $connID->query($query);
	if($result->num_rows > 0) {
		while($member = mysqli_fetch_assoc($result)) {
			array_push($members, $member);
		}
		return ($members);
	} else {
		return null;
	}
	closeConnection($connID);
}

function _createGroup($group_name, $creator_user_id){
	$query = "INSERT INTO groups(group_name,group_creator_user_id,member_count) VALUES('$group_name',$creator_user_id,1)";
	global $servername, $username, $password, $db;
	$connID = createConnection($servername, $username, $password, $db);
	$result = $connID->query($query);
	$inserted_id = $connID->insert_id;
	$query = "INSERT INTO group_users(group_id,member_user_id) VALUES($inserted_id,$creator_user_id)";
	$result2 = $connID->query($query);
	if($result && $result2){
		closeConnection($connID);
		return 'success';
	}
	else{
		closeConnection($connID);
		return null;
	}
}

function _toggleMembership($user_id, $group_id){
	$query = "CALL togglemembership($user_id,$group_id)";
	global $servername, $username, $password, $db;
	$connID = createConnection($servername, $username, $password, $db);
	$result = $connID->query($query);
	if($result){
		closeConnection($connID);
		return 'success';
	}
	else{
		closeConnection($connID);
		return null;
	}
}

function _getListofGroupPosts($group_id){
	global $servername, $username, $password, $db;
	$connID = createConnection($servername, $username, $password, $db);
	$query = "SELECT post_id FROM group_posts where group_id=$group_id";
	$result = $connID->query($query);
	$posts = [];
	while($r = mysqli_fetch_assoc($result)) {
		$posts[] = $r['post_id'];
	}
	closeConnection($connID);
	return $posts;
}
?>
