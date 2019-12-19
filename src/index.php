<?php
require_once 'common_functions.php';

if (!isset($_COOKIE['pennconnect'])){
	header('Location: signin.html');
	exit();
}
else
{
    $user = getSessionUserId($_COOKIE['pennconnect']);
    if($user != -1){
	    header('Location: newsfeed.html');
	    exit();
    }
    else{
	    header('Location: signin.html');
	    exit();
    }
}
?>
