var chartAlert = null;
var chartMood = null;
var chartAffection = null;
var chartInterest = null;
var chartExpectation = null;
var chartEmotion = null;

var dataPointsAlert;
var dataPointsMood;
var dataPointsAffection;
var dataPointsInterest;
var dataPointsExpectation;
var dataPointsEmotion;

function createGraphs() {
	dataPointsAlert = [{y : 0}, {y : 50}, {y : 60}, {y : 70}, {y : 80}, {y : 90}, {y : 95}, {y : 105}, {y : 100}];
	dataPointsMood = [{y : 0}, {y : 50}, {y : 45}, {y : 40}, {y : 35}, {y : 30}, {y : 30}, {y : 25}, {y : 35}];
	dataPointsAffection = [{y : 0}, {y : 50}, {y : 45}, {y : 40}, {y : 35}, {y : 30}, {y : 25}, {y : 25}, {y : 25}];
	dataPointsEmotion = [{y : 0}, {y : 50}, {y : 60}, {y : 78}, {y : 76}, {y : 83}, {y : 90}, {y : 100}, {y : 100}];
	chartAlert = new CanvasJS.Chart("chartContainerAlert", {
		theme: "light2",
		title:{
			text: "Fear",
			fontColor: "red"
		},
		axisX:{
			crosshair:{
				enabled: true //disable here
			}        
		},
		zoomEnabled:true,
		data: [{
			type: "splineArea",
			lineColor: "red",
			dataPoints: dataPointsAlert
		}]
	});
	chartAlert.render();

	chartMood = new CanvasJS.Chart("chartContainerMood", {
		theme: "light2",
		title:{
			text: "Joy",
			fontColor: "blue"
		},
		axisX:{
			crosshair:{
				enabled: true //disable here
			}        
		},
		zoomEnabled:true,
		data: [{
			type: "splineArea",

			lineColor: "blue",
			dataPoints: dataPointsMood
		}]
	});
	chartMood.render();

	chartAffection = new CanvasJS.Chart("chartContainerAffection", {
		theme: "light2",
		title:{
			text: "Approval",
			fontColor: "purple"
		},
		axisX:{
			crosshair:{
				enabled: true //disable here
			}        
		},
		zoomEnabled:true,
		data: [{
			type: "splineArea",
			lineColor: "purple",
			dataPoints: dataPointsAffection
		}]
	});
	chartAffection.render();

	chartEmotion = new CanvasJS.Chart("chartContainerEmotion", {
		theme: "light2",
		title:{
			text: "Total emotion",
			fontColor: "DarkSlateBlue"
		},
		axisX:{
			crosshair:{
				enabled: true //disable here
			}        
		},
		zoomEnabled:true,
		data: [{
			type: "splineArea",
			lineColor: "DarkSlateBlue",
			dataPoints: dataPointsEmotion
		}]
	});
	chartEmotion.render();

	//var btn = document.getElementById('add-points')
	//btn.onclick = addPoints("{\"alert\":24, \"interest\":39, \"mood\":76, \"expectation\":23, \"affection\":12}");

}

function addPoints(pointsJsonText) {
	var points = JSON.parse(pointsJsonText);
	
	dataPointsAlert.push({y : points.alert});
	dataPointsMood.push({y : points.mood});
	dataPointsAffection.push({y : points.affection});
	dataPointsInterest.push({y : points.interest});
	dataPointsExpectation.push({y : points.expectation});

	chartAlert.render();
	chartMood.render();
	chartAffection.render();
	chartInterest.render();
	chartExpectation.render();
}

window.resize = function () {
	chartAlert.render();
	chartMood.render();
	chartAffection.render();
	chartInterest.render();
	chartExpectation.render();
}