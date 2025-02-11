import { POINTS_TRESHOLDS, getUserLevel } from "@/utils/userLevels";

const UserVisitLevels = () => {
    return (
        <dialog id="user_levels" className="modal modal-bottom sm:modal-middle">
            <div className="modal-box">
                <h3 className="font-bold text-lg text-base-content">Uživatelské úrovně</h3>
                <p className="py-4 text-base-content">Na základě počtu návštívených rozhleden můžete odemknout následující úrovně:</p>
                <table className="table">
                    <thead>
                        <tr>
                            <th className="text-base-content text-wrap text-right pl-0">Navštívených rozhleden</th>
                            <th className="text-base-content">Odznak</th>
                        </tr>
                    </thead>
                    <tbody>
                        {POINTS_TRESHOLDS.map((points, idx) => {
                            const { name, color, level } = getUserLevel(points);
                            return (
                                <tr key={idx}>
                                    <td className="text-base-content text-right font-bold">{points}</td>
                                    <td>
                                        <div className="badge text-nowrap" style={{ backgroundColor: color, color: level > 3 ? "white" : "black" }}>
                                            {name}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                <div className="modal-action">
                    <form method="dialog">
                        <button className="btn">Zavřít</button>
                    </form>
                </div>
            </div>
        </dialog>
    );
};

export default UserVisitLevels;
