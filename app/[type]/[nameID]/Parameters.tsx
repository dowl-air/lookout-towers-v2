import React from "react";

function Parameters() {
    return (
        <div className="card prose w-full border border-secondary-focus overflow-hidden shadow-xl transition-transform duration-200 cursor-pointer hover:scale-105">
            <div className="card-body items-center ">
                <table className="table-compact w-full my-2">
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
        </div>
    );
}

export default Parameters;
