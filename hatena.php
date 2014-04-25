<?php
//phpinfo();
//exit();

//noticeエラーを出力しない
//error_reporting(E_ALL & ~E_NOTICE);

//文字コードの設定
mb_language('Japanese');
mb_internal_encoding('UTF-8');
mb_http_output('UTF-8');

//はてなキーワードを表示する関数
function getKeyword($proxy,$word){

	//プロキシ設定
	
	$proxy_context = null;
	
	if($proxy){
	$proxy_opts = array(
			'http' => array(
			'proxy' => 'tcp://proxy.noc.titech.ac.jp:3128',
			'request_fulluri' => true,
			)
	);
				
	$proxy_context=stream_context_create($proxy_opts);
	}
	
	//XMLデータ取得用ベースURL
	$req = "http://search.hatena.ne.jp/keyword";
	
	//XMLデータ取得用リクエストURL生成
	$req .= "?word=".urlencode($word)."&mode=rss2&ie=utf8&page=1";
	
	$xml_string=file_get_contents($req, false,$proxy_context);
	$xml_obj=simplexml_load_string($xml_string);

	//整形しjsonにエンコード
	$arrayData = get_object_vars($xml_obj);
	$arrayData = array( "results" => $arrayData);
	
	$fetchData = json_encode($arrayData);
	//$fetchData = array( "results" => $fetchData);
	
	return $fetchData;
	
}

$word = htmlspecialchars($_GET["w"]);
$fetchData = getKeyword(true, $word);

echo $fetchData;

/**
window.onload = function() {
	var request = new XmlRpcRequest("http://d.hatena.ne.jp/xmlrpc", "hatena.getSimilarWord");
	request.addParam({wordlist:"Tokyo"});
	var response = request.send();
	alert(response.parseXML());
}
**/

/**
require_once 'XML/RPC.php';
$text = "tokyo";
$out_text = hatena_keyword_link($text);
print_r($out_text);
function hatena_keyword_link( $body ){
	//$body = mb_convert_encoding( $body,'utf8',mb_internal_encoding() );
	$params = new XML_RPC_Value(array(
			"wordlist"     => new XML_RPC_Value( $body , "string" )
			//"score"    => new XML_RPC_Value( 0 , "int" ),
			//"a_target" => new XML_RPC_Value( '_blank', "string"),
			//"a_class"  => new XML_RPC_Value( 'keyword', "string")
	), "struct");
	$msg = new XML_RPC_Message("hatena.getSimilarWord", array($params));
	$client = new XML_RPC_Client( "/xmlrpc" , "d.hatena.ne.jp", 80 );
	$response = $client->send($msg);
	if (!$response->faultCode()) {
		$val = $response->value();
		$data = XML_RPC_decode($val);
		return $data;
	}
	else {
		//return PEAR::raiseError( $response->faultCode(), $response->faultString() );
	}
}
**/

//phpinfo();

/**
require_once("XML/RPC.php");

$host = "http://d.hatena.ne.jp"; // WordPressのホスト名
$method = "hatena.getSimilarWord";
//$user = "userid"; // WordPressのユーザーID
//$pass = "password"; // WordPressのパスワード
$xmlrpc = "/xmlrpc"; // XML-RPCのパス

//$param = new XML_RPC_Value("wordlist" => new XML_RPC_Value("tokyo", 'string'));

$myStruct = new XML_RPC_Value(array(
		//"name" => new XML_RPC_Value("Tom"),
		//"age" => new XML_RPC_Value(34, "int"),
		"wordlist" => new XML_RPC_Value("妹尾", "string")), "struct");

//$title = "記事のタイトル";
//$description = "記事の本文";

// クライアント作成
$client = new XML_RPC_client($xmlrpc, $host, 80);

// メッセージ作成
$message = new XML_RPC_Message(
		$method,
		array(
				$myStruct
				)
		
);

// メッセージ送信
$response = $client->send($message);

//エラー処理
if(!$response){
	echo "Post Failed.\n";
}elseif($response->faultCode()){
 	exit($response->faultString());
}
$response = $response->value();
$response = XML_RPC_decode($response);
print_r($response);

**/
?>

