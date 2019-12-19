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

function getListofGroupPosts(){
	$input = (array) json_decode(file_get_contents('php://input'), TRUE);
	$group_id = $input["group_id"];
	return _getListofGroupPosts($group_id);
}

function getGroupPost(){
	$input = (array) json_decode(file_get_contents('php://input'), TRUE);
	$post_ids = $input['post_ids'];
	$posts = array();
	foreach($post_ids as $post_id){
		$post_data = getPostFromId($post_id,TRUE);
		array_push($posts,$post_data);
	}
	return $posts;
}

function getGroupDetailsForUser(){
	$input = (array) json_decode(file_get_contents('php://input'), TRUE);
	if($input["user_id"] == -1){
		$user_id = getSessionUserId($_COOKIE['pennconnect']);
	}
	else{
		$user_id = $input["user_id"];
	}
	return _getGroupDetailsForUser($user_id);
}
function userDetails() {
	$resp = array();
	$input = (array) json_decode(file_get_contents('php://input'), TRUE);
	$user_id = $input["user_id"];
	$current_user_id = getSessionUserId($_COOKIE['pennconnect']);
	if($user_id == -1){
		$user_id = $current_user_id;
	}
	$result = getUserDetails($user_id);
	if($user_id != $current_user_id){
		$result["friend_status"] = getFriendStatus($user_id,$current_user_id);
	}
	else{
		$result["editable"] = TRUE;
	}
	if($result != -1){
		return $result;
	}
	else{
		return null;
	}

}

function toggleFriendStatus(){
	$input = (array) json_decode(file_get_contents('php://input'), TRUE);
	$friend_user_id = $input["friend_user_id"];
	$user_id = getSessionUserId($_COOKIE['pennconnect']);
	$friendStatus = getFriendStatus($user_id,$friend_user_id);
	if($friendStatus){
		if(changeFriendStatus(false,$user_id,$friend_user_id)){
			return "unfriended";
		}
	}
	else{
		if(changeFriendStatus(true,$user_id,$friend_user_id)){
			return "friended";
		}
	}
}

function searchForString() {
	$input = (array) json_decode(file_get_contents('php://input'), TRUE);
	$search_str = $input['search_string'];
	$result = array();
	if (($temp = getUserFromSearchString($search_str)) != -1) {
		array_push($result, $temp);
	}
	if (($temp = getGroupFromSearchString($search_str)) != -1) {
		array_push($result, $temp);
	}
	if (($temp = getEventFromSearchString($search_str)) != -1) {
		array_push($result, $temp);
	}
	return $result;
}

function searchEvents() {
	$input = (array) json_decode(file_get_contents('php://input'), TRUE);
	$search_str = $input['search_string'];
	return (getEventFromSearchString($search_str));
}

function searchGroup() {
	$input = (array) json_decode(file_get_contents('php://input'), TRUE);
	$search_str = $input['search_string'];
	return (getGroupFromSearchString($search_str));
}

function searchUser() {
	$input = (array) json_decode(file_get_contents('php://input'), TRUE);
	$search_str = $input['search_string'];
	return (getUserFromSearchString($search_str));
}

function editProfile() {
	$input = (array) json_decode(file_get_contents('php://input'), TRUE);
	$user_id = getSessionUserId($_COOKIE['pennconnect']);
	$edit_columns = $input['edit_columns'];
	$new_values = array();
	foreach ($edit_columns as $column) {
		array_push($new_values, $input["$column"]);
	}
	if(($ret = editProfileAttribute($user_id, $edit_columns, $new_values)) == null) {
		return null; 
	}	

	return $ret;
}

function editPost($postType){
	$input = (array) json_decode(file_get_contents('php://input'), TRUE);
	$post_id = $input['post_id'];
	$edit_columns = $input['edit_columns'];
	$new_values = array();
	foreach ($edit_columns as $column) {
		array_push($new_values, $input["$column"]);
	}
	if(($ret = editPostAttribute($post_id, $edit_columns, $new_values, $postType)) == null) {
		return null; 
	}	

	return $ret;
}

function findUsersPosts() {
	$input = (array) json_decode(file_get_contents('php://input'), TRUE);
	$user_id = $input["user_id"];
	if($user_id == -1){
		$user_id = getSessionUserId($_COOKIE['pennconnect']);
	}
	$postIDs = array();
	$postIDs = getUserPosts($user_id);
	return $postIDs;
}


function getPosts(){
	$input = (array) json_decode(file_get_contents('php://input'), TRUE);
	$user_id = getSessionUserId($_COOKIE['pennconnect']);
	$post_ids = $input['post_ids'];
	$posts = array();
	foreach($post_ids as $post_id){
		$post_data = getPostFromId($post_id,FALSE);
		array_push($posts,$post_data);
	}
	return $posts;
}
function createNewPost() {
	$input = (array) json_decode(file_get_contents('php://input'), TRUE);
	$user_id = getSessionUserId($_COOKIE['pennconnect']);
	$media_url = "";
	if (isset($input['media_url'])) {
		$media_url = $input['media_url'];
	}
	$ret = insertPost($user_id, $input['post_type'], $input['text'], $input['timestamp'], $media_url);
	if($ret){
		return $ret;
	}
	else{
		return null;
	}
}

function getComment() {
	$input = (array) json_decode(file_get_contents('php://input'), TRUE);
	$post_ids = $input['post_ids'];
	$posts = array();
	$comments = array();
	foreach($post_ids as $post_id){
#$commentIDs = getCommentIDs($post_id);
#foreach ($commentIDs as $commentID) {
	$comment_data = getCommentFromId($post_id);
	array_push($comments, $comment_data);
	//}
	}
	return $comments;
}

function createNewComment() {
	$input = (array) json_decode(file_get_contents('php://input'), TRUE);
	$user_id = getSessionUserId($_COOKIE['pennconnect']);
	$ret = insertComment($user_id, $input['post_id'], $input['text'], $input['timestamp']);
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
	$ret = createNewUser($input['FirstName'], $input['LastName'], $input['Gender'], $input['Email'], $input['Password'], $input['Nationality'], $input['DateOfBirth'],$input["Major"],$input["DegreeType"],$input["GradYear"]);
	return $ret;
}

function processGetRequest($requestType, $getSpec) {
	switch ($requestType) {
		//case 'comment':
		//return (getComment($getSpec));
		default:
			notFoundResponse();
	}
}

function subscribeToEvent() {
	$input = (array) json_decode(file_get_contents('php://input'), TRUE);
	$event_id = $input['event_id'];
	$user_id = getSessionUserId($_COOKIE['pennconnect']);
	$status = $input['subscription_status'];
	if (!($status == 'interested' || 
				$status == 'going' || 
				$status == 'cancel')) {
				#Invalid subscription status
		return null;
	} else {
		$resp = manageEventSubscription($event_id, 
				$user_id, $status);
		return($resp);
	}
}

function getUserEventList() {
	$user_id = getSessionUserId($_COOKIE['pennconnect']);
	$resp = getUserEventListFromID($user_id);
	return($resp);

}

function getEventDetails() {
	$input = (array) json_decode(file_get_contents('php://input'), TRUE);
	$user_id = getSessionUserId($_COOKIE['pennconnect']);
	$event_id = $input['event_id'];
	$resp = getEventFromID($event_id, $user_id);
	return($resp);
}

function getEventParticipants() {
	$input = (array) json_decode(file_get_contents('php://input'), TRUE);
	$event_id = $input['event_id'];
	$resp = getEventParticipantsFromID($event_id);
	return($resp);
}

function deleteEvent() {
	$input = (array) json_decode(file_get_contents('php://input'), TRUE);
	$event_id = $input['event_id'];
	$user_id = getSessionUserId($_COOKIE['pennconnect']);
	$resp = deleteEventAsAdmin($event_id, $user_id);
	return($resp);
}

function createEvent() {
	$input = (array) json_decode(file_get_contents('php://input'), TRUE);
	$event_name = $input['event_name'];
	$user_id = getSessionUserId($_COOKIE['pennconnect']);
	$resp = createNewEvent($event_name, $user_id);
	return($resp);
}
function createGroup(){
	$input = (array) json_decode(file_get_contents('php://input'), TRUE);
	$group_name = $input['group_name'];
	$user_id = getSessionUserId($_COOKIE['pennconnect']);
	$resp = _createGroup($group_name,$user_id);
	return $resp;
}

function toggleMembership(){
	$input = (array) json_decode(file_get_contents('php://input'), TRUE);
	$user_id = getSessionUserId($_COOKIE['pennconnect']);
	$group_id = $input['group_id'];
	return _toggleMembership($user_id,$group_id);
}

function getAnanlytics(){
	return _getAnalytics();
}

function getGroupDetails(){
	$input = (array) json_decode(file_get_contents('php://input'), TRUE);
	$group_id = $input["group_id"];
	$user_id = getSessionUserId($_COOKIE['pennconnect']);
	return _getGroupDetails($group_id,$user_id);
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
		case 'create_comment':
			return (createNewComment());
			break;
		case 'getcomment':
			return (getComment());
			break;
		case 'toggle_friend':
			return toggleFriendStatus();
			break;
		case 'userdetails':
			return userDetails();
			break;
		case 'userposts':
			return findUsersPosts();
			break;
		case 'editpost':
			return editPost(TRUE);
			break;
		case 'editgrouppost':
			return editPost(FALSE);
			break;
			/*
			   case 'searchuser':
			   return searchUser();
			   break;
			   case 'searchgroup':
			   return searchGroup();
			   break;
			   case 'searchevent':
			   return searchEvents();
			   break;
			 */
		case 'search':
			return searchForString();
			break;
		case 'getgroupdetails':
			return getGroupDetails();
			break;
		case 'listgroups':
			return getGroupDetailsForUser();
			break;
		case 'creategroup':
			return createGroup();
			break;
		case 'togglemembership':
			return toggleMembership();
			break;
		case 'get_group_posts':
			return getListofGroupPosts();
		case 'get_group_post_data':
			return getGroupPost();
			break;
		case 'create_event':
			return createEvent();
			break;
		case 'manage_event_subscription':
			return subscribeToEvent();
		case 'delete_event':
			return deleteEvent();
			break;
		case 'get_event_participants':
			return getEventParticipants();
			break;
		case 'get_this_event':
			return getEventDetails();
			break;
		case 'get_event_list_for_user':
			return getUserEventList();
			break;
		case 'analytics':
			return getAnanlytics();
			break;
		case 'edit-profile':
			return editProfile();
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
			$output = processGetRequest($requestType, $getSpec);
			if($output == null){
				$response = null;
			}
			else{
				$response['body'] = $output;
			}
			break;
		case 'POST':
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

