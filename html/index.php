<!DOCTYPE HTML>

<html>
  <head>
    <title>Grafico do seno com o DDS</title>
    <meta charset="utf-8"></meta>

    <style type="text/css">
      @import url("../css/page.css");
    </style>

	<script type="text/javascript">
	var values = <?php

		function CORDIC (&$x1,&$y1,&$z1) { //CORDIC
			$p = 1;
			for ($i = 0;$i <= 11;$i++){
				if ($z1 >= 0) {
					$x2 = $x1-$y1/$p;
					$y2 = $y1+$x1/$p;
					$z2 = $z1-atan(1/$p);
				} 
				else{ 
					$x2 = $x1+$y1/$p;
					$y2 = $y1-$x1/$p;
					$z2 = $z1+atan(1/$p);
				}
				
				$z1 = $z2;
				$x1 = $x2;
				$y1 = $y2;
				$p *= 2;
			}	

			$x1 = $x1/1.6467;
			$y1 = $y1/1.6467;
		}

		function q1sin ($angle) {
			$x1 = 0;
			$y1 = 1;

			CORDIC($x1,$y1,$angle);
			
			return -$x1; //Por quê?
		}
		echo "[";

		for ($i = 0 ; $i < 4 ; $i++){ // DDS
			for ($j = 0; $j < M_PI/2; $j+=M_PI/180){
				switch ($i){
					case 0: //1º quadrante
						$saida = q1sin($j); //Ao chamar a função é enviado o ângulo como parâmetro.
						break;
					case 1: 
						$saida = q1sin((M_PI/2) - $j); //Por que M_PI/2 - j ?
						break;
					case 2:
						$saida = -q1sin($j);
						break;
					case 3:
						$saida = -q1sin((M_PI/2) - $j); 
						break;
				}
				/*echo "<b>A fase: </b> ".($j+($i*M_PI/2))."</br>";
				//echo cos($j*$i);// - (-1.57)) = -cos ($z1);
				echo "<i>Seno: </i> " .sin($j+($i*M_PI/2))."</br>";// 
				echo "<i>Cosseno: </i> " .cos($j+($i*M_PI/2))."</br>";// 
				echo "<u>Saida</u>: ".$saida."</br>"; 		*/
			
				echo $saida.",";
			}
		}
		echo "]";
		?>;
	</script>
	
    <script type="text/javascript" src="../js/html5.js/html5.js"></script>
    <script type="text/javascript" src="../js/interpolation.js"></script>    
    <script type="text/javascript" src="../js/graph.js"></script>
    <script type="text/javascript" src="../js/jquery.js"></script>    
  </head>
  
  <body>
    <canvas id="main_canvas" width="640" height="480">
      Your browser don't support canvas
    </canvas>
    <script type="text/javascript" src="../js/drawgraph.js"></script>
  </body>
</html>
