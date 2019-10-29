<?php
ini_set('display_errors', 1);
require_once 'common_functions.php';

function getNewsFeed(){
	$input = (array) json_decode(file_get_contents('php://input'), TRUE);
	$user_id = getSessionUserId($_COOKIE['pennconnect']);
	$user_friends = getUserFriends($user_id);
	array_push($user_friends,$user_id);
	$posts = array();
	foreach($user_friends as $friend){
		$posts = array_merge($posts,getUserPosts($friend));
		//sort chronologically here
	}
	return $posts;
	
}

function userDetails($user_id) {
	$resp = array();
	$result = getUserDetails($user_id); 
	if($result != -1){
		return $result;
	}
	else{
		return null;
	}

}

function findUsersPostIDs($userID) {
	$resp = array();
	$resp['ID-List'] = array();
	$resp['ID-List'] = getUserPosts($userID);
	json_encode($resp);
	return($resp);	
}


function getPosts(){
	$input = (array) json_decode(file_get_contents('php://input'), TRUE);
	$user_id = getSessionUserId($_COOKIE['pennconnect']);
	$post_ids = $input['post_ids'];
	$posts = array();
	foreach($post_ids as $post_id){
		$post_data = getPostFromId($post_id);
		array_push($posts,$post_data);
	}
	return $posts;
}
function createNewPost() {
	$input = (array) json_decode(file_get_contents('php://input'), TRUE);
	$user_id = getSessionUserId($_COOKIE['pennconnect']);
	$ret = insertPost($user_id, "text" ,$input['text'], $input['timestamp']);
	if($ret){
		var_dump($ret);
		return $ret;
	}
	else{
		return null;
	}
}

function getComment($commentID) {

}

function createNewComment() {
	$input = (array) json_decode(file_get_contents('php://input'), TRUE);
	$user_id = getSessionUserId($_COOKIE['pennconnect']);
	$ret = insertComment($user_id, $input['post_id'], $input['text'], $input['timestamp'], input['date']);
	return $ret;
}

function login() {
	$input = (array) json_decode(file_get_contents('php://input'), TRUE);
	$email = $input['email'];
	$password = $input['password'];

	$user_id = getUserIdFromEmail($email);
	if($user_id == -1){
		return null;
	}
	else{
        	$hashed_pwd = sha1($password);
        	if(checkPassword($email, $hashed_pwd)){
			$session_id = loginUser($user_id);
			if($session_id == '-1'){
				$session_id = getUserSessionToken($user_id);
				if($session_id == -1){
					return null;
				}
			}
			setcookie("pennconnect",$session_id,time() + 3600 * 24 * 30, "/");
			header("HTTP/1.1 200 OK");
                	return "success";
		}
		else{
			return null;
		}
	}
}

function logout() {
	$session_token = $_COOKIE['pennconnect'];
	$ret = logoutUser($session_token);
	return $ret;
}

function addNewUser() {
	#echo "Need to create user: ";
	$input = (array) json_decode(file_get_contents('php://input'), TRUE);
	$ret = createNewUser($input['FirstName'], $input['LastName'], $input['Gender'], $input['Email'], $input['Password'], $input['Nationality'], $input['DateOfBirth']);
	return $ret;
}

function processGetRequest($requestType, $getSpec) {
	switch ($requestType) {
	case 'current-user':
		$userID = getSessionUserId($_COOKIE['pennconnect']);
		return userDetails($userID);
		break;
	case 'this-user':
		return (userDetails($_GET["user_id"]));
		break;
	case 'user-posts':
		return (findUsersPostIDs($getSpec));
		break;
	case 'comment':
		return (getComment($getSpec));
	default:
		notFoundResponse();
	}
}

function processPostRequest($requestType) {
	switch ($requestType) {
	case 'user':
		return (addNewUser());
		break;
	case 'login':
		return login();
		break;
	case 'logout':
		return logout();
		break;
	case 'post':
		return (createNewPost());
		break;
	case 'newsfeed':
		return getNewsFeed();
		break;
	case 'getpost':
		return getPosts();
		break;
	case 'comment':
		return (createNewComment());
		break;
	default:
		notFoundResponse();
	}
}

function processPutRequest($requestType) {

}

function processDeleteRequest($requestType) {

}

function notFoundResponse() {

}

function processRequest($requestMethod, $requestType, $getSpec)
{	
	$response = array();
	switch ($requestMethod) {
	case 'GET':
		#$response['status_code_header'] = "HTTP/1.1 200 OK";
		$output = processGetRequest($requestType, $getSpec);
		if($output == null){
			#$response['status'] = 'success';
			$response = null;
		}
		else{
			$response['body'] = $output;
		}
		break;
	case 'POST':
		#$response['status_code_header'] = "HTTP/1.1 200 OK";
		$output = processPostRequest($requestType);
		if(null == $output){
			$response = null;
		}
		else{
			$response['body'] = $output;
		}
		break;
	case 'PUT':
		$response = processPutRequest($request);
		break;
	case 'DELETE':
		$response = processDeleteRequest($request);
		break;
	default:
		$response = notFoundResponse();
		break;
	}
	return $response;	
	#if ($response['body']) {
		#echo $response['body'];
	#}
}

?>
