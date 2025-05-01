import { FC } from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
}

const ProgressBar: FC<ProgressBarProps> = ({ current, total }) => {
  return (
    <div className="mb-8">
      <div className="text-center text-gray-600">
        Exercise {current} / {total}
      </div>
      <div className="h-2 bg-gray-200 rounded-full mt-2">
        <div
          className="h-full bg-[#58CC02] rounded-full"
          style={{
            width: `${((current) / total) * 100}%`,
          }}
          aria-valuenow={current}
          aria-valuemax={total}
          aria-valuemin={1}
          role="progressbar"
        />
      </div>
    </div>
  );
};

export default ProgressBar; 