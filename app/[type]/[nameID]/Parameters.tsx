import React from "react";

function Parameters() {
    return (
        <div className="w-full border border-base-content rounded-md flex items-center justify-center overflow-hidden">
            <table className="table-compact w-full">
                <tbody>
                    {/* row 1 */}
                    <tr>
                        <th>Materiál</th>
                        <td>Quality Control Specialist</td>
                    </tr>
                    {/* row 2 */}
                    <tr>
                        <th>Počet schodů</th>
                        <td>42</td>
                    </tr>
                    {/* row 3 */}
                    <tr>
                        <th>Výška</th>
                        <td>20 metrů</td>
                    </tr>
                    <tr>
                        <th>Rok zpřístupnění</th>
                        <td>2005</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default Parameters;
