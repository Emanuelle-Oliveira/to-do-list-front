import { PointerSensor, useSensor, useSensors } from '@dnd-kit/core';

export default function sensors() {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 5,
      },
    }),
  );
  return sensors;
}