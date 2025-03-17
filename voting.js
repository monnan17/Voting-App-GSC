// Enable button only when both fields are filled
document.getElementById("voterId").addEventListener("input", checkInputs);
document.getElementById("party").addEventListener("change", checkInputs);

function checkInputs() {
    let voterId = document.getElementById("voterId").value;
    let party = document.getElementById("party").value;
    document.getElementById("voteBtn").disabled = !(voterId && party);
}

async function submitVote() {
    let voterId = document.getElementById("voterId").value;
    let party = document.getElementById("party").value;
    let messageBox = document.getElementById("message");

    let response = await fetch("http://127.0.0.1:8080/vote", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "voter_id": voterId
        },
        body: JSON.stringify({ party })
    });

    let data = await response.json();

    if (response.ok) {
        messageBox.style.color = "green";
        messageBox.textContent = "✅ Vote recorded successfully!";
        // Now fetch the results and display the chart
        fetchVoteResults();
    } else {
        messageBox.style.color = "red";
        messageBox.textContent = "❌ " + data.error;
    }
}

async function fetchVoteResults() {
    const response = await fetch("http://127.0.0.1:8080/votes");
    const data = await response.json();

    if (response.ok) {
        // Display chart
        document.getElementById("chartContainer").style.display = "block";
        renderChart(data.percentages);
    }
}

function renderChart(percentages) {
    const ctx = document.getElementById("voteChart").getContext("2d");
    const chart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ["BJP", "AAP", "CONGRESS", "NOTA"],
            datasets: [{
                label: "Vote Distribution",
                data: [
                    percentages.BJP || 0,
                    percentages.AAP || 0,
                    percentages.CONGRESS || 0,
                    percentages["JUICE WRLD"] || 0
                ],
                backgroundColor: ["#ff6384", "#36a2eb", "#ffcd56", "#4caf50"],
                borderColor: ["#fff", "#fff", "#fff", "#fff"],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: "top",
                },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            return tooltipItem.label + ": " + tooltipItem.raw.toFixed(2) + "%";
                        }
                    }
                }
            }
        }
    });
}

// Go back to the voting form
document.getElementById("goBackBtn").addEventListener("click", function() {
    document.getElementById("chartContainer").style.display = "none";
    document.getElementById("voteBtn").disabled = false; // Re-enable voting button
});
