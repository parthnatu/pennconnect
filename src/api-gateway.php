<?php

# Required scripts
#require_once "formvalidator.php";
ini_set('display_errors', 1);
require_once "common_functions.php";
require_once "process-requests.php";

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: OPTIONS,GET,POST,PUT,DELETE");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers");

if (!isset($_SERVER['REQUEST_URI'])){
	echo "Exiting Request URI not found";
}

$request = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$request = explode( '/', $request );

// all of our endpoints start with /person
// everything else results in a 404 Not Found
if ($request[2] !== 'penn-connect') {
	header("HTTP/1.1 404 Not Found");
	echo "Exiting... condition1 failed";
	exit();
}

if (!isset($request[3])) {
	header("HTTP/1.1 404 Not Found");
	echo "Exiting... condition1 failed";
	exit();
}

$requestType = $request[3];
$requestMethod = $_SERVER["REQUEST_METHOD"];

processRequest($requestMethod, $requestType);

?>
