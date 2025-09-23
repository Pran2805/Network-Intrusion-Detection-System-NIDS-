import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere, Line, Html } from '@react-three/drei';
import { useRef, useState, useMemo } from 'react';
import { Vector3 } from 'three';
import type { Alert } from '@/pages/Dashboard';

interface NetworkNode {
  id: string;
  position: Vector3;
  type: 'server' | 'client' | 'threat';
  ip: string;
  threatLevel?: number;
}

interface NetworkVisualizationProps {
  alerts: Alert[];
}

function NetworkNode({ node, onClick }: { node: NetworkNode; onClick: (node: NetworkNode) => void }) {
  const meshRef = useRef<any>(0);

  const color = useMemo(() => {
    switch (node.type) {
      case 'server': return '#00ff88'; 
      case 'threat': return '#ff4444'; 
      default: return '#4488ff';
    }
  }, [node.type]);

  const size = useMemo(() => {
    return node.type === 'threat' ? 0.3 + (node.threatLevel || 0) * 0.2 : 0.2;
  }, [node.type, node.threatLevel]);

  return (
    <group position={node.position}>
      <Sphere 
        ref={meshRef}
        args={[size, 16, 16]}
        onClick={() => onClick(node)}
      >
        <meshStandardMaterial 
          color={color} 
          emissive={color}
          emissiveIntensity={node.type === 'threat' ? 0.3 : 0.1}
          transparent
          opacity={0.8}
        />
      </Sphere>
      
      {/* Pulsing effect for threats */}
      {node.type === 'threat' && (
        <Sphere args={[size * 1.5, 16, 16]}>
          <meshBasicMaterial 
            color={color}
            transparent
            opacity={0.1}
          />
        </Sphere>
      )}
      
      {/* IP Label */}
      <Html distanceFactor={10} position={[0, size + 0.3, 0]}>
        <div className="bg-background/80 backdrop-blur-sm px-2 py-1 rounded text-xs text-foreground border border-border">
          {node.ip}
        </div>
      </Html>
    </group>
  );
}

function ConnectionLine({ start, end, isAttack = false }: { start: Vector3; end: Vector3; isAttack?: boolean }) {
  const points = useMemo(() => [start, end], [start, end]);
  
  return (
    <Line
      points={points}
      color={isAttack ? '#ff4444' : '#4488ff'}
      lineWidth={isAttack ? 3 : 1}
      transparent
      opacity={isAttack ? 0.8 : 0.3}
    />
  );
}

export function NetworkVisualization({ alerts }: NetworkVisualizationProps) {
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);

  const { nodes, connections } = useMemo(() => {
    // Create server node (center)
    const serverNode: NetworkNode = {
      id: 'server',
      position: new Vector3(0, 0, 0),
      type: 'server',
      ip: '192.168.1.1'
    };

    // Create client nodes in a circle
    const clientNodes: NetworkNode[] = Array.from({ length: 8 }, (_, i) => {
      const angle = (i / 8) * Math.PI * 2;
      const radius = 3;
      return {
        id: `client-${i}`,
        position: new Vector3(
          Math.cos(angle) * radius,
          Math.sin(angle) * radius * 0.5,
          Math.sin(angle) * radius
        ),
        type: 'client',
        ip: `192.168.1.${10 + i}`
      };
    });

    // Create threat nodes from recent alerts
    const threatNodes: NetworkNode[] = alerts.slice(0, 10).map((alert, i) => {
      const angle = Math.random() * Math.PI * 2;
      const radius = 4 + Math.random() * 2;
      const threatLevel = alert.severity === 'critical' ? 1 : 
                         alert.severity === 'high' ? 0.8 :
                         alert.severity === 'medium' ? 0.6 : 0.4;
      
      return {
        id: alert.id,
        position: new Vector3(
          Math.cos(angle) * radius,
          (Math.random() - 0.5) * 4,
          Math.sin(angle) * radius
        ),
        type: 'threat',
        ip: alert.sourceIP,
        threatLevel
      };
    });

    const allNodes = [serverNode, ...clientNodes, ...threatNodes];

    // Create connections
    const connections = [
      // Client to server connections
      ...clientNodes.map(client => ({
        start: client.position,
        end: serverNode.position,
        isAttack: false
      })),
      // Threat to server connections
      ...threatNodes.map(threat => ({
        start: threat.position,
        end: serverNode.position,
        isAttack: true
      }))
    ];

    return { nodes: allNodes, connections };
  }, [alerts]);

  return (
    <div className="w-full h-full rounded-lg overflow-hidden bg-gradient-to-br from-background via-background to-secondary/20">
      <Canvas camera={{ position: [8, 5, 8], fov: 60 }}>
        {/* Lighting */}
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={0.8} color="#4488ff" />
        <pointLight position={[-10, -10, -10]} intensity={0.4} color="#00ff88" />

        {/* Grid */}
        <gridHelper args={[20, 20, '#333355', '#222244']} />

        {/* Network Nodes */}
        {nodes.map(node => (
          <NetworkNode 
            key={node.id} 
            node={node} 
            onClick={setSelectedNode}
          />
        ))}

        {/* Connections */}
        {connections.map((conn, i) => (
          <ConnectionLine 
            key={i}
            start={conn.start}
            end={conn.end}
            isAttack={conn.isAttack}
          />
        ))}

        {/* Central Server Label */}
        <Html position={[0, -1, 0]} center>
          <div className="bg-secure/20 backdrop-blur-sm px-3 py-2 rounded-lg border border-secure/30 text-secure font-semibold">
            Main Server
          </div>
        </Html>

        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={20}
        />
      </Canvas>

      {/* Selected Node Info */}
      {selectedNode && (
        <div className="absolute top-4 right-4 bg-card/90 backdrop-blur-sm border border-border rounded-lg p-4 max-w-xs">
          <h4 className="font-semibold text-sm mb-2">Node Information</h4>
          <div className="space-y-1 text-xs">
            <div><span className="text-muted-foreground">IP:</span> {selectedNode.ip}</div>
            <div><span className="text-muted-foreground">Type:</span> {selectedNode.type}</div>
            {selectedNode.threatLevel && (
              <div><span className="text-muted-foreground">Threat Level:</span> {Math.round(selectedNode.threatLevel * 100)}%</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}