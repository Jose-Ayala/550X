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

        // Extract the season id for each event and store it in the $seasons variable
        $.each(events.data, function (index, item) {
            if (item.season && item.season.id && !$seasons.includes(item.season.id)) {
                $seasons.push(item.season.id);
            }
        });

        console.log('Seasons:', $seasons);

        const awards = await getTeamAwards($team, $seasons);
        console.log('Awards:', awards);
        cachedAwardsData = awards.data;

        // Fetch events data
        const eventsResponse = await getTeamEvents($team, $start);
        const eventsData = eventsResponse.data;

        // Create a map of event IDs to event start dates
        const eventDateMap = {};
        eventsData.forEach(event => {
            eventDateMap[event.id] = event.start;
        });

        // Merge awards with their corresponding event dates
        cachedAwardsData.forEach(award => {
            award.event.start_date = eventDateMap[award.event.id];
        });

        // Sort the awards by event start date in descending order
        cachedAwardsData.sort((a, b) => new Date(b.event.start_date) - new Date(a.event.start_date));

        if (Array.isArray(cachedAwardsData)) {
            let awardsTableBody = $('#awardsTable tbody');
            awardsTableBody.empty(); // Clear any existing content

            // Inside your forEach loop for cachedAwardsData
			cachedAwardsData.forEach(function (award) {
				let row = $('<tr></tr>');
				
				// Use regex to remove everything in parentheses, including the parentheses themselves
				let cleanedTitle = award.title.replace(/\s*\(.*?\)\s*/g, '').trim();

				let awardTitleCell = $('<td></td>').text(cleanedTitle);
				let eventNameCell = $('<td></td>').text(award.event.name);
				let eventDateCell = $('<td></td>').text(new Date(award.event.start_date).toLocaleDateString('en-US', {
					month: '2-digit',
					day: '2-digit',
					year: 'numeric'
				}));

    row.append(awardTitleCell);
    row.append(eventNameCell);
    row.append(eventDateCell);
    awardsTableBody.append(row);
});

        }
    } catch (error) {
        console.error('Error:', error);
    }
});
