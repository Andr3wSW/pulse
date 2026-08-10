import { auth, db } from "./firebase.js";

import {
    collection,
    query,
    where,
    orderBy,
    onSnapshot,
    getDoc,
    doc
}
from
"https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


const reportsList =
document.getElementById(
    "reportsList"
);

const openReportCount =
document.getElementById(
    "openReportCount"
);


let currentUser = null;


// ==========================
// AUTH
// ==========================

auth.onAuthStateChanged(
async(user)=>{

    if(!user)
        return;


    currentUser = user;


    const userSnap =
    await getDoc(
        doc(
            db,
            "users",
            user.uid
        )
    );


    if(!userSnap.exists())
        return;


    const userData =
    userSnap.data();


    const role =
    userData.role || "user";


    const allowedRoles = [
        "owner",
        "admin",
        "moderator"
    ];


    if(!allowedRoles.includes(role)){

        console.log(
            "Moderation access denied."
        );

        return;

    }


    loadReports();

});


// ==========================
// LOAD REPORTS
// ==========================

function loadReports(){

    const reportsQuery =
    query(

        collection(
            db,
            "reports"
        ),

        where(
            "status",
            "==",
            "open"
        ),

        orderBy(
            "createdAt",
            "desc"
        )

    );


    onSnapshot(
        reportsQuery,
        async(snapshot)=>{

            if(!reportsList)
                return;


            reportsList.innerHTML = "";


            if(openReportCount){

                openReportCount.textContent =
                snapshot.size;

            }


            if(snapshot.empty){

                reportsList.innerHTML = `

                    <div class="empty-state">

                        <h3>
                            No open reports
                        </h3>

                        <p>
                            Everything is clear.
                        </p>

                    </div>

                `;

                return;

            }


            for(
                const reportDoc
                of snapshot.docs
            ){

                const report =
                reportDoc.data();


                const reporterSnap =
                await getDoc(

                    doc(
                        db,
                        "users",
                        report.reportedBy
                    )

                );


                const reportedSnap =
                await getDoc(

                    doc(
                        db,
                        "users",
                        report.reportedUser
                    )

                );


                const reporter =
                reporterSnap.exists()
                ?
                reporterSnap.data()
                :
                null;


                const reported =
                reportedSnap.exists()
                ?
                reportedSnap.data()
                :
                null;


                createReportCard(
                    reportDoc.id,
                    report,
                    reporter,
                    reported
                );

            }

        },

        (error)=>{

            console.error(
                "Failed to load reports:",
                error
            );

        }

    );

}


// ==========================
// REPORT CARD
// ==========================

function createReportCard(
    reportID,
    report,
    reporter,
    reported
){

    const card =
    document.createElement(
        "div"
    );


    card.className =
    "report-card";


    const reporterName =
    reporter
    ?
    `@${reporter.username}`
    :
    "Unknown user";


    const reportedName =
    reported
    ?
    `@${reported.username}`
    :
    "Unknown user";


    let dateText =
    "Unknown date";


    if(
        report.createdAt &&
        report.createdAt.toDate
    ){

        dateText =
        report.createdAt
        .toDate()
        .toLocaleString();

    }


    card.innerHTML = `

        <div class="report-card-header">

            <div>

                <span class="report-reason">
                    ${escapeHTML(
                        formatReason(
                            report.reason
                        )
                    )}
                </span>

            </div>

            <span class="report-date">
                ${escapeHTML(dateText)}
            </span>

        </div>


        <div class="report-users">

            <p>
                <strong>Reported user:</strong>
                ${escapeHTML(reportedName)}
            </p>

            <p>
                <strong>Reported by:</strong>
                ${escapeHTML(reporterName)}
            </p>

        </div>


        ${
            report.details
            ?
            `
            <div class="report-details">

                ${escapeHTML(
                    report.details
                )}

            </div>
            `
            :
            ""
        }


        <div class="report-status">

            <span>
                Open
            </span>

        </div>

    `;


    reportsList.appendChild(
        card
    );

}


// ==========================
// FORMAT REASON
// ==========================

function formatReason(reason){

    if(!reason)
        return "Unknown";


    return reason
        .charAt(0)
        .toUpperCase()
        +
        reason.slice(1)
        .replace(
            /_/g,
            " "
        );

}


// ==========================
// HTML SAFETY
// ==========================

function escapeHTML(value){

    if(value === null || value === undefined)
        return "";


    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}