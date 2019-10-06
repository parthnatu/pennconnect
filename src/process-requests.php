<?php
ini_set('display_errors', 1);
require_once 'common_functions.php';

function showUsers() {
	$resp = array();
	$result = showExistingUsers(); 
	while($row = $result->fetch_assoc()) {
		$resp[]=$row;
	}
	#echo json_encode($resp);
	return $resp;
}
function login(){
	$input = (array) json_decode(file_get_contents('php://input'), TRUE);
	$email = $input['email'];
	$password = $input['password'];

	$user_id = getUserIdFromEmail($email);
	if($user_id == -1){
        	return "USER_NOT_EXIST";
	}
	else{
        	$hashed_pwd = sha1($password);
        	if(checkPassword($email, $hashed_pwd)){
			$session_id = loginUser($user_id);
			if($session_id == '-1'){
				return "failure";
			}
			setcookie("pennconnect",$session_id);
                	return "success";
        	}
	}
}
function logout(){
	$input = (array) json_decode(file_get_contents('php://input'), TRUE);
	$session_token = $input['session_token'];
	$ret = logoutUser($session_token);
	return $ret;
}
function addNewUser() {
	#echo "Need to create user: ";
	$input = (array) json_decode(file_get_contents('php://input'), TRUE);
	$ret = createNewUser($input['FirstName'], $input['LastName'], $input['Gender'], $input['Email'], $input['Password'], $input['Nationality'], $input['DateOfBirth']);
	return $ret;
}

function processGetRequest($requestType) {
	switch ($requestType) {
	case 'user':
		return (showUsers());
		break;
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

function processRequest($requestMethod, $requestType)
{
	$response = array();
	switch ($requestMethod) {
	case 'GET':
		$response = processGetRequest($requestType);
		break;
	case 'POST':
		$response['status_code_header'] = "HTTP/1.1 200 OK";
		$response['body'] = processPostRequest($requestType);
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

	#if ($response['body']) {
		#echo $response['body'];
	#}
	echo json_encode($response);
}

?>
