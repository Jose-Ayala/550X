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

        const eventsResponse = await getTeamEvents($team, $start);
        console.log('Team Events:', eventsResponse);

        // Sort events by start date in descending order
        eventsResponse.data.sort((a, b) => new Date(b.start) - new Date(a.start));

        // Populate dropdown with events
        let competitionDropdown = $('#competitionDropdown');
        eventsResponse.data.forEach(event => {
            let eventDate = new Date(event.start).toLocaleDateString('en-US');
            let option = $('<option></option>').val(event.id).text(`${event.name} (${eventDate})`);
            competitionDropdown.append(option);
        });

        const skillsResponse = await getSkills($team, $seasons);
        console.log('Skills Response:', skillsResponse);

        const rankingsResponse = await getTeamRankings($team, $seasons);
        console.log('Rankings Response:', rankingsResponse);

        const awardsResponse = await getTeamAwards($team, $seasons);
        console.log('Awards Response:', awardsResponse);

        // Event listener for dropdown change
        competitionDropdown.on('change', function () {
            let selectedEventId = $(this).val();
            console.log('Selected Event ID:', selectedEventId);

            if (selectedEventId) {
                const event = eventsResponse.data.find(event => event.id == selectedEventId);
                const skillsData = skillsResponse.data.filter(skill => skill.event.id == selectedEventId);
                const rankingData = rankingsResponse.data.find(ranking => ranking.event.id == selectedEventId);
                const awardsData = awardsResponse.data.filter(award => award.event.id == selectedEventId);

                let driverScore = 0;
                let programmingScore = 0;
                skillsData.forEach(skill => {
                    if (skill.type === 'driver') {
                        driverScore = skill.score;
                    } else if (skill.type === 'programming') {
                        programmingScore = skill.score;
                    }
                });
                const totalScore = driverScore + programmingScore;

                // Display event details, skills scores, rankings, and awards
                $('#competitionDetails').html(`
					<br>
                    <h2>${event.name}</h2>
                    <h3><strong>Date:</strong> ${new Date(event.start).toLocaleDateString('en-US')}</h3>
                    <h4><strong>Location:</strong> ${event.location.venue}</h4>
					<br>
                    <h3>Skills Scores</h3>
                    <table class="table table-striped">
                        <tr>
                            <th>Driver</th>
                            <th>Programming</th>
                            <th>Total</th>
                        </tr>
                        <tr>
                            <td>${driverScore}</td>
                            <td>${programmingScore}</td>
                            <td>${totalScore}</td>
                        </tr>
                    </table>					
                    
					${rankingData ? `
					<br>
                    <h3>Rankings</h3>
                    <table class="table table-striped">
                        <tr>
                            <th>Rank</th>
                            <th>Wins</th>
                            <th>Losses</th>
                            <th>Ties</th>
                            <th>WP</th>
                            <th>AP</th>
                            <th>SP</th>
                        </tr>
                        <tr>
                            <td>${rankingData.rank}</td>
                            <td>${rankingData.wins}</td>
                            <td>${rankingData.losses}</td>
                            <td>${rankingData.ties}</td>
                            <td>${rankingData.wp}</td>
                            <td>${rankingData.ap}</td>
                            <td>${rankingData.sp}</td>
                        </tr>
                    </table>
                    ` : '<p>No ranking data available for this event.</p>'}
					
					<br>
                    <h3>Awards</h3>
					<table class="table table-striped">
						<tr>
							<th>Award Title</th>
						</tr>
						${awardsData.length > 0 ? awardsData.map(award => `
						<tr>
							<td>${award.title}</td>
						</tr>`).join('') : `
						<tr>
							<td>No awards received at this event.</td>
						</tr>`}
					</table>

                `);
            }
        });
    } catch (error) {
        console.error('Error fetching events, skills, rankings, or awards data:', error);
    }
});
