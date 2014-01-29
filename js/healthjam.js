
var LABELS = {
	"complete": "Complete"
	};

var PEOPLE = [
		{
			"id": 0,
			"name": "Tomi Koskinen",
			"health": 95,
			"bugs": 2,
			"pills": [
				{
					"id": 0,
					"steps": 3,
					"start": 2
				}
			],
			"spots": [
				{
				 "x": "104px",
				 "y": "83px"
				 },
				{
				 "x": "160px",
				 "y": "169px"
				 }
			]
		},
		{
			"id": 1,
			"name": "Jaakko-Petteri Koskinen",
			"health": 66,
			"bugs": 4,
			"pills": [
				{
					"id": 0,
					"steps": 3,
					"start": 2
				},
				{
					"id": 1,
					"steps": 4,
					"start": 1
				}
			],
			"spots": [
				{
				 "x": "104px",
				 "y": "83px"
				 },
				{
				 "x": "113px",
				 "y": "228px"
				 },
				{
				 "x": "149px",
				 "y": "83px"
				 }
			]
		},
		{
			"id": 2,
			"name": "Tiina Koskinen",
			"health": 100,
			"bugs": 0,
			"pills": []
		}
	];

var $app;

function updateProgress(container, person) {
	var $bar = container.find(".progress-bar");
	var val = $bar.data("value");
	var start = $bar.data("start");
	var $sr = $bar.find(".sr-only");
	if (val !== 100) {
		val += (100 / $bar.data("steps"));
		start++;
		if (val > 100) {
			val = 100;
		}
		$bar.data("value", val);
		$bar.data("start", start);
		$bar.attr("aria-valuenow", val);
		$bar.css({
			"width": val + "%"
		});
		$sr.html(val + "% " + LABELS.complete);
		for (var i=0; i<person.pills.length; i++) {
			if (person.pills[i].id == $bar.data("id")) {
				person.pills[i].start = start;
			}
		}
	}
}

function changePerson(direction) {
	var id = $app.data("id");
	if (direction == "prev") {
		id--;
	} else {
		id++;
	}
	if (id == PEOPLE.length) {
		id = 0;
	} else if (id < 0) {
		id = PEOPLE.length - 1;
	}
	return PEOPLE[id];
}

function updateId(person) {
	$app.data("id", person.id);
}

function updateName(person) {
	$app.find(".js-name").text(person.name);
}

function updateData(person) {
	$app.find(".js-health").text(person.health);
	$app.find(".js-bugs").text(person.bugs);
	$app.find(".js-pills").text(person.pills.length);
}

function addProgressBars(person) {
	var source = $("#counter-template").html();
	var template = Handlebars.compile(source);
	$("#counters").append(template(person));
}

function addSpots(person) {
	var source = $("#spot-template").html();
	var template = Handlebars.compile(source);
	$("#spots").append(template(person));
}

Handlebars.registerHelper("startPlace", function(steps, start) {
	return (100 / steps) * start;
});

$(document).ready(function() {
	$app = $("#app-content");
	var newPerson = PEOPLE[0];

	addProgressBars(newPerson);
	addSpots(newPerson);

	$app.on("click", ".js-progress", function(e) {
		e.preventDefault();
		updateProgress($(this).parents(".counter"), newPerson);
	});
	
	$("#controls").on("click", ".js-change-person", function(e) {
		newPerson = changePerson($(this).data("direction"));
		updateId(newPerson);
		updateName(newPerson);
		updateData(newPerson);
		$("#counters").empty();
		$("#spots").empty();
		addProgressBars(newPerson);
		addSpots(newPerson);
	});
	
});


