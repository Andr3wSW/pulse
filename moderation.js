import { auth, db } from "./firebase.js";

import {
    collection,
    query,
    where,
    orderBy,
    getDocs,
    getDoc,
    doc,
    updateDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


// ==========================
// ELEMENTS
// ==========================

const reportsList =
    document.getElementById("reportsList");

const openReportCount =
    document.getElementById("openReportCount");


// ==========================
// STATE
// ==========================

let currentUser = null;


// ==========================
// AUTH
// ==========================

auth.onAuthStateChanged(async (user) => {

    if (!user)
        return;

    currentUser = user;

    await loadReports();

});


// ==========================
// LOAD REPORTS
// ==========================

async function loadReports() {

    try {

        const reportsQuery = query(
            collection(db, "reports"),
            where("status", "==", "open"),
            orderBy("createdAt", "desc")
        );

        const snapshot =
            await getDocs(reportsQuery);

        if (openReportCount) {

            openReportCount.textContent =
                snapshot.size;

        }

        reportsList.innerHTML = "";

        if (snapshot.empty) {

            reportsList.innerHTML = `
                <div class="empty-state">
                    No open reports.
                </div>
            `;

            return;
        }

        for (const reportDoc of snapshot.docs) {

            const data =
                reportDoc.data();

            const card =
                await createReportCard(
                    reportDoc.id,
                    data
                );

            reportsList.appendChild(card);
        }

    } catch (error) {

        console.error(
            "Failed to load reports:",
            error
        );

        reportsList.innerHTML = `
            <div class="empty-state">
                Failed to load reports.
            </div>
        `;
    }
}


// ==========================
// CREATE REPORT CARD
// ==========================

async function createReportCard(
    reportID,
    data
) {

    const card =
        document.createElement("div");

    card.className =
        "moderation-report";

    let reportedName =
        "Unknown User";

    let reporterName =
        "Unknown User";


    // Reported user

    if (data.reportedUser) {

        const reportedSnap =
            await getDoc(
                doc(
                    db,
                    "users",
                    data.reportedUser
                )
            );

        if (reportedSnap.exists()) {

            const user =
                reportedSnap.data();

            reportedName =
                `${user.firstName} ${user.lastName || ""}`;
        }
    }


    // Reporter

    if (data.reportedBy) {

        const reporterSnap =
            await getDoc(
                doc(
                    db,
                    "users",
                    data.reportedBy
                )
            );

        if (reporterSnap.exists()) {

            const user =
                reporterSnap.data();

            reporterName =
                `${user.firstName} ${user.lastName || ""}`;
        }
    }


    card.innerHTML = `

        <div class="moderation-report-info">

            <h3>
                ${escapeHTML(reportedName)}
            </h3>

            <p>
                Reported by
                ${escapeHTML(reporterName)}
            </p>

            <p>
                Reason:
                ${escapeHTML(
                    data.reason || "Unknown"
                )}
            </p>

        </div>

        <div class="moderation-report-status">

            <span class="count-badge">
                Open
            </span>

        </div>

    `;


    card.onclick = () => {

        openReport(
            reportID,
            data,
            reportedName,
            reporterName
        );

    };


    return card;
}


// ==========================
// OPEN REPORT
// ==========================

function openReport(
    reportID,
    data,
    reportedName,
    reporterName
) {

    const panel =
        document.createElement("div");

    panel.className =
        "report-review-panel";


    panel.innerHTML = `

        <div class="report-review-header">

            <h2>
                Report Details
            </h2>

            <button
                class="close-report-review"
            >
                ×
            </button>

        </div>


        <div class="report-review-content">

            <p>
                <strong>
                    Reported User:
                </strong>

                ${escapeHTML(reportedName)}
            </p>


            <p>
                <strong>
                    Reporter:
                </strong>

                ${escapeHTML(reporterName)}
            </p>


            <p>
                <strong>
                    Reason:
                </strong>

                ${escapeHTML(
                    data.reason || "Not provided"
                )}
            </p>


            <p>
                <strong>
                    Details:
                </strong>
            </p>


            <div class="report-description">

                ${escapeHTML(
                    data.details ||
                    data.description ||
                    "No additional details."
                )}

            </div>


            <p>
                <strong>
                    Status:
                </strong>

                Open
            </p>


            <div class="report-review-actions">

                <button
                    class="secondary dismiss-report"
                >
                    Dismiss Report
                </button>


                <button
                    class="primary timeout-report"
                >
                    Timeout User
                </button>

            </div>

        </div>

    `;


    document.body.appendChild(panel);


    // Close

    panel
        .querySelector(".close-report-review")
        .onclick = () => {

            panel.remove();

        };


    // Dismiss

    panel
        .querySelector(".dismiss-report")
        .onclick = async () => {

            await dismissReport(
                reportID,
                panel
            );

        };


    // Timeout

    panel
        .querySelector(".timeout-report")
        .onclick = async () => {

            await timeoutUser(
                reportID,
                data,
                panel
            );

        };
}


// ==========================
// DISMISS REPORT
// ==========================

async function dismissReport(
    reportID,
    panel
) {

    try {

        await updateDoc(

            doc(
                db,
                "reports",
                reportID
            ),

            {
                status: "dismissed",

                resolvedBy:
                    currentUser.uid,

                resolvedAt:
                    serverTimestamp()
            }

        );


        panel.remove();

        await loadReports();

    } catch (error) {

        console.error(
            "Failed to dismiss report:",
            error
        );

        alert(
            "Failed to dismiss report."
        );
    }
}


// ==========================
// TIMEOUT USER
// ==========================

async function timeoutUser(
    reportID,
    data,
    panel
) {

    if (!data.reportedUser) {

        alert(
            "This report does not contain a reported user."
        );

        return;
    }


    const confirmed =
        confirm(
            "Timeout this user for 24 hours?"
        );


    if (!confirmed)
        return;


    try {

        const timeoutUntil =
            new Date(
                Date.now() +
                (24 * 60 * 60 * 1000)
            );


        await updateDoc(

            doc(
                db,
                "users",
                data.reportedUser
            ),

            {
                timeoutUntil:
                    timeoutUntil,

                timeoutReason:
                    data.reason ||
                    "User reported"
            }

        );


        await updateDoc(

            doc(
                db,
                "reports",
                reportID
            ),

            {
                status: "resolved",

                action: "timeout",

                resolvedBy:
                    currentUser.uid,

                resolvedAt:
                    serverTimestamp()
            }

        );


        panel.remove();

        await loadReports();


        alert(
            "User has been timed out for 24 hours."
        );

    } catch (error) {

        console.error(
            "Failed to timeout user:",
            error
        );

        alert(
            "Failed to timeout user."
        );
    }
}


// ==========================
// HTML ESCAPE
// ==========================

function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}
```
