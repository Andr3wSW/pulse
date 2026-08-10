import { auth, db } from "./firebase.js";

import {
    collection,
    query,
    where,
    orderBy,
    getDocs,
    getDoc,
    doc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


const reportsList =
    document.getElementById("reportsList");

const openReportCount =
    document.getElementById("openReportCount");


let currentUser = null;


auth.onAuthStateChanged(async (user) => {

    if (!user) {
        return;
    }

    currentUser = user;

    loadReports();

});


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
                document.createElement("div");

            card.className =
                "moderation-report";


            let reportedName =
                "Unknown User";


            if (data.reportedUser) {

                const userSnap =
                    await getDoc(
                        doc(
                            db,
                            "users",
                            data.reportedUser
                        )
                    );


                if (userSnap.exists()) {

                    const user =
                        userSnap.data();


                    reportedName =
                        `${user.firstName} ${user.lastName || ""}`;
                }
            }


            card.innerHTML = `
                <div class="moderation-report-info">

                    <h3>
                        ${reportedName}
                    </h3>

                    <p>
                        Reason:
                        ${data.reason || "Unknown"}
                    </p>

                    <p>
                        ${data.details || "No additional details."}
                    </p>

                </div>

                <div class="moderation-report-status">

                    <span class="count-badge">
                        Open
                    </span>

                </div>
            `;


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