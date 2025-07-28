import React from 'react'

function UserStocks() {
    return (
        <div className="">
            <table className="table-fixed">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="h-10 w-40 border border-gray-300">
                            Company
                        </th>
                        <th className="h-10 w-40 border border-gray-300">
                            Qty
                        </th>
                        <th className="h-10 w-40 border border-gray-300">
                            Cost Price (Avg)
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="h-10 border border-gray-300">TSLA</td>
                        <td className="border border-gray-300">10</td>
                        <td className="border border-gray-300">200.0</td>
                    </tr>
                    <tr>
                        <td className="h-10 border border-gray-300">NVDA</td>
                        <td className="border border-gray-300">15</td>
                        <td className="border border-gray-300">180.0</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default UserStocks
