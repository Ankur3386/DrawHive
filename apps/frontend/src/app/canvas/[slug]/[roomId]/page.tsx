import { RoomCanvas } from "@/components/RoomCanvas";

export default async function CanvasPage({
  params,
}: {
  params: { roomId: string; slug: string };
}) {
  const { roomId, slug } = await(params);
  console.log(roomId)

  return <RoomCanvas roomId={roomId} />;
}