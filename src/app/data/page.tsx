'use client'

import Image from 'next/image';
import React, { useEffect, useState } from 'react'

type Data = {
    Id: number;
    Name: string;
    Description: string;
    ImageUrl: string;
}

const data = () => {
    const [data, setData] = useState<Data[]>([])

    const carsData = async () => {
        try {
            const response = await fetch(`/api/data`);
            const result = await response.json();

            if (!response.ok) {
                alert(result.error);
                return;
            }

            setData(result?.data);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        carsData();
    }, []);

    return (
        <div className="px-6 py-4">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6">Data Showcase</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {data.map((d, index) => (
                    <div
                        key={index}
                        className="bg-white shadow-lg rounded-2xl overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl"
                    >
                        <Image
                            src={d?.ImageUrl}
                            alt={d.Name}
                            width={400}
                            height={300}
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                            <h3 className="text-xl font-bold text-gray-700">{d.Name}</h3>
                            <p className="text-gray-600 text-sm mt-2">{d.Description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default data;
