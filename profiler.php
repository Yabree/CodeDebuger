<?php
/* DELETE IF NOT NEEDED
ini_set('display_errors',1);
ini_set('display_startup_errors',1);
error_reporting(-1);
ini_set('display_errors','On');

error_reporting(E_ALL | E_STRICT);
*/


	/** DEFINE SETTINGS */
	DEFINE('PROFILES_DIR', '/profiles/');

	/**
	* Ajax Profiler PHP
	*/
	class AjaxProfiler{

		function __construct(){
			$this->profilesData = [];
			$this->loadProfiles();
		}

		function getProfiles(){
			return $this->profilesData;
		}

		function loadDataFile($profileName, $profilePath){
			return file_get_contents($profilePath.'/'.$profileName.'/config.json');
		}

		function parseDataFile($file){
			return json_decode($file, TRUE);
		}

		function loadProfiles(){
			$iterator = new DirectoryIterator(dirname(__FILE__).PROFILES_DIR);
			foreach ($iterator as $file) {
			    if ($file->isDir() && !$file->isDot()) {

			    	// get profile data -> config.json
			    	$dataFile = $this->loadDataFile($file->getFilename(), $file->getPath());

			    	$dataFile = $this->parseDataFile($dataFile);
			        $processedClass = $dataFile['processed'] === true ? 'processedOK' : 'processedNot';
			        echo '<li>'.$dataFile['name'].'<i data-id="'.$file->getFilename().'" class="'.$processedClass.'"></i>';
			        echo '<ul class="profiles">';
			        $this->loadProfilesAccounts($file, $dataFile);
			        echo '</ul>';
			        echo '</li>';
			    }
			}
		}

		function loadProfilesAccounts($dir){
			$iterator = new DirectoryIterator(dirname(__FILE__).PROFILES_DIR.$dir.'/data/');
			foreach ($iterator as $file) {
				if ($file->isDir() && !$file->isDot()) {
					echo '<li>';
					echo '<a <a href=".'.PROFILES_DIR.$dir->getFilename().'/index.html?profile='.$file.'">'.$file.'</a>';
					echo '</li>';
				}
			}
		}
	}

	$ap = new AjaxProfiler();
	$profiles = $ap->getProfiles();



	class ProfileCreator{
		function __construct(){
			if($this->canCreate()){
				$this->profile_path = 'profiles/';
				$this->profile_name = $_POST['profile_name'];
				$this->profile_folder = $_POST['profile_folder'];
				$this->profile_URI = $this->profile_path.$this->profile_folder;
				$this->config = [
					'name' => $this->profile_name,
					'processed' => false
				];
				//if($this->isNotAProfile())
					$this->createProfile();
				//else{
				//	echo 'Profile already exists!';
				//}
			}
		}

		// can create profile ? check $_POST
		function canCreate(){
			if(!isset($_POST['action'])) return false;
			if($_POST['action'] !== 'create_profile') return false;
			if($_POST['profile_folder'] === '') return false;
			if($_POST['profile_name'] === '') return false;
			return true;
		}

		function isNotAProfile(){
			if(file_exists($this->profile_URI))
				return false;
			else
				return true;
		}

		function createProfile(){
			echo ' TWORZE PROFILE!';
			$this->createFolders();
			$this->copyTemplateFiles();
			$this->createConfig();
		}

		function createFolders(){
			mkdir($this->profile_URI);
			mkdir($this->profile_URI.'/data');
			mkdir($this->profile_URI.'/data/default@default');
		}

		// copy the template profile
		function copyTemplateFiles(){
			copy('data/template/index.html', $this->profile_URI.'/index.html');
		}

		function createConfig(){
			file_put_contents($this->profile_URI.'/config.json', json_encode(($this->config)));
		}
	}


	$pc = new ProfileCreator();


	class ProfileProcessor{

		function __construct(){
			if($this->canProcess()){
				$this->id = $_POST['id'];
				$this->path = 'profiles/'.$this->id;
				$this->AJAX = '<script src="../../AjaxRewriter/AjaxRewriterPluginManager.js" type="text/javascript"></script> <script src="../../AjaxRewriter/AR_Downloader.js" type="text/javascript"></script> <script src="../../AjaxRewriter/AjaxRewriterController.js" type="text/javascript"></script> <script src="../../AjaxRewriter/AjaxRewriter.js" type="text/javascript"></script> <script>if(typeof AjaxRewriter !== "undefined"){var AR = new AjaxRewriter(); AR.initialize();}</script>';


				$this->process();
				$this->setProcessed();
			}
		}

			/**
			* STATIC FUNCTIONS
			*/
			static function canProcess(){
				if(!isset($_POST['action'])) return false;
				if($_POST['action'] !== 'process_profile') return false;
				if($_POST['id'] === '') return false;
				return true;
			}

			static function splitName($filename) {
				return explode('.', $filename);
			}

			public function forEachProfile($callback){
				$iterator = new DirectoryIterator($this->path.'/data/');
				foreach ($iterator as $file) {
					if ($file->isDir() && !$file->isDot()) {
						$callback($file);
					}
				}
			}

			public function hasExtension($file, $extArray){
				foreach($extArray as $ext){
					if($ext === $this->splitName($file)[1]){
						return true;
					}
				}
				return false;
			} 

			public function forEachFile($path, $profile, $extArray, $callback){
				$iterator = new DirectoryIterator($path);
				foreach ($iterator as $file) {
					if (!$file->isDir() && !$file->isDot()) {
						if($this->hasExtension($file, $extArray)){
							$callback($profile, $file);
						}
					}
				}				
			}


		/**
		* Main processing functions
		*/
		public function process(){
			
			// for each profiles
			$this->forEachProfile(function($profile){
				$this->processDoHtmlFiles($profile);
				$this->processHtmlFiles($profile);
			});

			// main profile folder
			$this->processMainHtml('');
			$this->injectAjaxRewriter();
		}



		public function openFile($filename){
			echo '<br>open: '.$this->path.'/'.$filename.'<br><br>';
			return file_get_contents($this->path.'/'.$filename, true);
		}

		public function saveFile($filename, $data){
			file_put_contents($this->path.'/'.$filename, $data);
		}

		public function processHtmlFiles($profile){
			$path = $profile !== '' ? $this->path.'/data/'.$profile.'/' : $this->path.'/../';
			echo '-------profile: ' .$profile.'<br>';
			echo 'path: '.$path.'<br>';
			echo '<br><hr><br>';
			$this->forEachFile($path, 'data/'.$profile.'/', ['htm', 'html', 'dohtml'], function($profile, $file){
				echo '<br><br>';
				echo '<hr>';
				echo $profile.'<br>';
				echo $file.'<br>';
				echo '<br>';

				$html = $this->openFile($profile.$file);
				$html = preg_replace('/<!-- MOBIFY(.*?)END MOBIFY -->/', '', $html);
				$this->saveFile($profile.$file, $html);
			});

			/*
			$html = $this->openFile('index.html');
			$html = preg_replace('/<!-- MOBIFY(.*?)END MOBIFY -->/', '', $html);
			$this->saveFile('index.html', $html);*/
		}

		public function processMainHtml(){
			$html = $this->openFile('index.html');
			$html = preg_replace('/<!-- MOBIFY(.*?)END MOBIFY -->/', '', $html);
			$this->saveFile('index.html', $html);	
		}

		public function processDoHtmlFiles($profile){
			$path = $profile !== '' ? $this->path.'/data/'.$profile.'/' : $this->path.'/data/';
			$this->forEachFile($path, 'data/'.$profile.'/', ['htm'], function($profile, $file){
				$splited = $this->splitName($file);
				rename($this->path.'/'.$profile.$file, $this->path.'/'.$profile.$splited[0].'.dohtml');
			});
		}

		public function injectAjaxRewriter(){
			$html = $this->openFile('index.html');
			if(!preg_match('/(AjaxRewriter)/', $html)){
				$html = preg_replace('/(\<\/head\>)/', $this->AJAX.'</head>', $html);
			}
			$this->saveFile('index.html', $html);
		}





		public function setProcessed(){
			$config = json_decode(file_get_contents($this->path.'/config.json'), true);
			$config['processed'] = true;
			file_put_contents($this->path.'/config.json', json_encode(($config)));
			header("Refresh:0");
		}
	}

	$pp = new ProfileProcessor();

?>