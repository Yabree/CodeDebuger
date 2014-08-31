

<html>
<head>
    <meta charset="utf-8">
    <link href="assets/css/main.css" rel="stylesheet" media="screen" />
    <script src="assets/lib/jquery.js" type="text/javascript"></script>
    <style>
    * {box-sizing: border-box;}

    body, html, a, a:focus, ul, li, h1, h2{
    	color: whitesmoke;
    	text-decoration: none;
    	list-style: none;
    	margin: 0; padding: 0;
    }

    a:hover{
    	color: yellow;
    }

    body{
    	padding: 10px;
    }

    div.wrapper{
    	width: 100%;
    	max-width: 1024px;
    	margin: 0px auto;
    	background: rgba(255, 255, 255, 0.5);
    	padding: 20px;
        padding-top: 40px;
    	border-radius: 5px;
    	border: 1px solid whitesmoke;
        position: relative;
    }

    li{
    	background: #9cbad3;
    	border: 1px solid #8eacc5;
    	padding: 5px;
    	margin: 5px 0px;
    	cursor: pointer;
    }

    li:hover{
    	background: #96b4cd;
    }

    .newprofile{
        margin-top: 10px !important;
        padding: 10px;
    }

    hr{
        background: #5692c4;
        height: 1px;
        border: 1px solid #b9d7f0;
        border-width: 0px 0px 1px 0px;
    }

    i{
        float: right;
        cursor: pointer;
        display: block;
        width: 32px;
        height: 32px;
        background-size: 32px 32px;
    }

    i.processedOK{
        background-image: url('assets/img/processOK.png');
    }

    i.processedNOT{
        background-image: url('assets/img/processNot.png');
    }

    .hidden{
        max-height: 62px !important;
        overflow: hidden;
        cursor: pointer;
        opacity: 0.6;
    }

    .hidden h2{
        font-size: 16px;
        margin: 0px;
        margin-bottom: 20px;
    }

    .hidden:hover{
        background: #96B4CD;
        opacity: 1;
    }
    
    .logo{
        width: 80px;
        height: auto;
        position: absolute;
        right: 5px;
        top: 0px;
        border-radius: 100px;
        box-sizing: border-box;
        padding: 10px;
        background: whitesmoke;
    }

    .logo i{
        background:  url('assets/img/bt.png') no-repeat;
        background-size: 60px 60px;
        background-position: center center;
        width: 60px;
        height: 60px;
    }

    </style>
    <script>
        $(document).ready(function(){
            $('i').on('click', function(){
                var promise = $.ajax({
                    type : 'POST',
                    url : 'profiler.php',
                    data : {
                        'action' : 'process_profile',
                        'id' : $(this).data('id')
                    }
                });
                promise.done(function(){
                    location.reload();
                });
                return false;
            });

            $('.hidden').on('click', function(){
                $(this).removeClass('hidden');
            });
        });
    </script>
</head>
<body>

	<div class="wrapper">
        <div class="logo"><i></i></div>
		<h1>Profiles:</h1>
        
		<ul>
			<?php require_once('profiler.php'); ?>
		</ul>
	</div>

    <div class="wrapper newprofile hidden">
        <h2>Create profile</h2>
        <hr>
        <form action="" method="POST">
            <input type="text" name="profile_folder" placeholder="Profile folder">
            <input type="text" name="profile_name" placeholder="Profile name">
            <input type="hidden" name="action" value="create_profile">
            <input type="submit" value="Create new profile">
        </form>
    </div>


    <div class="wrapper newprofile hidden">
        <h2>FAQs</h2>
        <hr>
        <ul>
            <li>
                Create new profile
            </li>
            <li>
                Go to profile folder -> open the main html file
            </li>
            <li>
                Paste html here from the page u want to use ( copy html with the JS disabled - like firefox plugin )
            </li>
            <li>
                Install chrome extension BT_debugger.crx ( drag and drop to chrome extensions )
            </li>
            <li>
                Go to page u want to copy. Click the extension tab in top right corner ( bt logo )
            </li>
            <li>
                Wait for it to finished. Click download. Discard all js files.
            </li>
            <li>
                Copy saved files to default@default profile
            </li>
            <li>
                Click process icon just on right from your profile name on Debuger page
            </li>
            <li>
                Open the profile by clicking on the profile name
            </li>
            <li>
                radoslaw.swiat@bt.com
            </li>
        </ul>
    </div>

</body>
</html>