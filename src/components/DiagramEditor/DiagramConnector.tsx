import React, { useState, useEffect } from 'react';
import { RelationType, relationColors } from './types';

interface Point {
  x: number;
  y: number;
}

interface DiagramConnectorProps {
  id: string;
  startPoint: Point;
  endPoint: Point;
  type: RelationType;
  onUpdate: (id: string, startPoint: Point, endPoint: Point) => void;
  onDelete: (id: string) => void;
}

const DiagramConnector: React.FC<DiagramConnectorProps> = ({
  id,
  startPoint,
  endPoint,
  type,
  onUpdate,
  onDelete,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragPoint, setDragPoint] = useState<'start' | 'end' | null>(null);
  const [path, setPath] = useState('');

  useEffect(() => {
    const dx = endPoint.x - startPoint.x;
    const dy = endPoint.y - startPoint.y;
    const controlPoint1 = {
      x: startPoint.x + dx / 3,
      y: startPoint.y,
    };
    const controlPoint2 = {
      x: startPoint.x + (dx * 2) / 3,
      y: endPoint.y,
    };

    const pathData = `
      M ${startPoint.x},${startPoint.y}
      C ${controlPoint1.x},${controlPoint1.y}
        ${controlPoint2.x},${controlPoint2.y}
        ${endPoint.x},${endPoint.y}
    `;

    setPath(pathData);
  }, [startPoint, endPoint]);

  const handleMouseDown = (point: 'start' | 'end') => (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDragging(true);
    setDragPoint(point);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !dragPoint) return;

    const newPoint = {
      x: e.clientX,
      y: e.clientY,
    };

    if (dragPoint === 'start') {
      onUpdate(id, newPoint, endPoint);
    } else {
      onUpdate(id, startPoint, newPoint);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragPoint(null);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const getArrowPoints = (point: Point, isStart: boolean) => {
    const angle = Math.atan2(
      endPoint.y - startPoint.y,
      endPoint.x - startPoint.x
    );
    const length = 10;
    const spread = Math.PI / 6;

    const baseAngle = isStart ? angle + Math.PI : angle;
    
    return [
      point,
      {
        x: point.x + length * Math.cos(baseAngle + spread),
        y: point.y + length * Math.sin(baseAngle + spread),
      },
      {
        x: point.x + length * Math.cos(baseAngle - spread),
        y: point.y + length * Math.sin(baseAngle - spread),
      },
    ];
  };

  const startArrow = getArrowPoints(startPoint, true);
  const endArrow = getArrowPoints(endPoint, false);
  const color = relationColors[type];

  return (
    <svg
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 40 }}
    >
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth="2"
      />

      <path
        d={`M ${startArrow[0].x},${startArrow[0].y} L ${startArrow[1].x},${startArrow[1].y} L ${startArrow[2].x},${startArrow[2].y} Z`}
        fill={color}
      />
      <path
        d={`M ${endArrow[0].x},${endArrow[0].y} L ${endArrow[1].x},${endArrow[1].y} L ${endArrow[2].x},${endArrow[2].y} Z`}
        fill={color}
      />

      <circle
        cx={startPoint.x}
        cy={startPoint.y}
        r="5"
        fill={color}
        className="cursor-move pointer-events-auto"
        onMouseDown={handleMouseDown('start')}
      />
      <circle
        cx={endPoint.x}
        cy={endPoint.y}
        r="5"
        fill={color}
        className="cursor-move pointer-events-auto"
        onMouseDown={handleMouseDown('end')}
      />
    </svg>
  );
};

export default DiagramConnector;