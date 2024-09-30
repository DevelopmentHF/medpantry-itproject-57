import React from 'react';

interface OrderLineProps {
	name: string;
	quantity: number;
	boxNumbers: number[]; // Expecting an array of numbers for box numbers
}

export default function OrderLine({ name, quantity, boxNumbers }: OrderLineProps) {
	// Validate boxNumbers to ensure it's an array of numbers
	const isBoxNumbersValid = (numbers: any): numbers is number[] => {
		return Array.isArray(numbers) && numbers.every(num => typeof num === 'number');
	};

	return (
		<div className={`flex gap-4`}>
			<div className="">
				<h1 className="">
					{name} <span className='text-gray-500'>x{quantity}</span>
				</h1>
			</div>
			<div className="">
				<h2 className='text-black'>
					Box{' '}
					<span className='text-gray-500'>
						{isBoxNumbersValid(boxNumbers) && boxNumbers.length > 0
							? `#${boxNumbers.join(', ')}`
							: 'N/A'}
					</span>
				</h2>
			</div>
		</div>
	);
}
