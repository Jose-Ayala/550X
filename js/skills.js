$(document).ready(async function () {
    try {
        const team = await getTeamInfo($team);
        console.log('Team-Info:', team);
        $("#title").text(team.number + ' - ' + team.team_name);
        $("#teamId").text(team.id);
        $("#teamNumber").text(team.number);
        $("#teamName").text(team.number + ' - ' + team.team_name);
        $("#organization").text(team.organization);
        $("#location").text(team.location?.city + ', ' + team.location.region + ' ' + team.location.postcode);
        $("#country").text(team.location.country);
        $("#programName").text(team.program.code + ' - ' + team.program.name);
        $("#gameMessage").text('This years Vex V5 Robotics competition "High Stakes", team ' + team.number + ' consists of:');

        const events = await getTeamEvents($team, $start);
        console.log('Team Events:', events);

        // Extract the season id and event details for each event
        $.each(events.data, function (index, item) {
            if (item.season && item.season.id && !$seasons.includes(item.season.id)) {
                $seasons.push(item.season.id);
            }
            $events.push({
                name: item.name,
                date: item.start,
                season: item.season.id
            });
        });

        console.log('Seasons:', $seasons);
        console.log('Events:', $events);

        const skills = await getSkills($team, $seasons);
        console.log('Skills:', skills);

        // Load Google Charts and draw the chart
        google.charts.load('current', { packages: ['corechart'] });
        google.charts.setOnLoadCallback(function() {
            drawChart(skills.data);
        });

    } catch (error) {
        console.error('Error:', error);
    }

    // Function to draw the chart
    function drawChart(data) {
        var chartData = new google.visualization.DataTable();
        chartData.addColumn('string', 'Date'); // Use 'string' type for the date
        chartData.addColumn('number', 'Total Score');
        chartData.addColumn({ type: 'string', role: 'tooltip', 'p': { 'html': true } });

        const events = [...new Set(data.map(item => item.event.name))];

        events.forEach(event => {
            const eventDetails = $events.find(e => e.name === event);
            if (eventDetails) {
                const driverScore = data.find(item => item.event.name === event && item.type === 'driver')?.score || 0;
                const programmingScore = data.find(item => item.event.name === event && item.type === 'programming')?.score || 0;
                const totalScore = driverScore + programmingScore;
                const fullDate = new Date(eventDetails.date);
                const formattedDate = `${(fullDate.getMonth() + 1).toString().padStart(2, '0')}/${fullDate.getDate().toString().padStart(2, '0')}/${fullDate.getFullYear().toString().slice(-2)}`; // Format the date as MM/DD/YY
                const axisLabel = `${(fullDate.getMonth() + 1).toString().padStart(2, '0')}/${fullDate.getFullYear().toString().slice(-2)}`; // Format the date as MM/YY
                const tooltip = `<div style="padding:10px; color: black; background-color: white;"><strong>${event}</strong><br><strong>Event Date:</strong> ${formattedDate}<br><strong>Total Score:</strong> ${totalScore}<br><strong>Driver Score:</strong> ${driverScore}<br><strong>Programming Score:</strong> ${programmingScore}</div>`;
                chartData.addRow([axisLabel, totalScore, tooltip]);
            } else {
                console.error('Event details not found for:', event);
            }
        });

        var options = {
            title: 'Total Skills Scores by Competition',
            titleTextStyle: { color: 'white' },
            legend: { position: 'bottom', textStyle: { color: '#212529' } },
            vAxis: { ticks: [0, 100, 200, 300, 400, 500] },
            height: 600,
            tooltip: { isHtml: true }
        };

        var chart = new google.visualization.LineChart(document.getElementById('chart'));
        chart.draw(chartData, options);
    }
});
