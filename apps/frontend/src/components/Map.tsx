import React, { useEffect, useRef } from 'react';
// import { Button, Result } from 'antd';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as D3 from 'd3';
import { useMapStore } from '../stores';

const MapPage: React.FC = () => {
    const mountRef = useRef<HTMLDivElement>(null);
    const getData = useMapStore(state => state.getData);
    const map = useMapStore(state => state.map);
    // const

    console.log(map);
    useEffect(() => {
        if (map === null) {
            getData();
        }
    }, []);

    useEffect(() => {
        // 初始化场景

        // 检查 mountRef.current 是否存在，以及其 childNodes 是否存在且长度大于 0
        if (mountRef.current && mountRef.current.childNodes && mountRef.current.childNodes.length > 0) {
            return;
        }
        console.log(0)
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xaaaaaa);
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(1000, 800);

        mountRef.current?.appendChild(renderer.domElement); // 将渲染器的DOM元素添加到ref对应的元素中
        // 添加控制器
        // const controls = new OrbitControls(camera, renderer.domElement);

        if (map !== null) {
            // const projection = D3.geoMercator().fitSize([800, 600], map);
            // const geometry = new THREE.BufferGeometry();
            // // 坐标转换和处理...
            // const cube = new THREE.Mesh(geometry, projection);
            // scene.add(cube);
            createSichuanShape(scene, map);
            // 创建几何体和材质
            
        }
        // const geometry = new THREE.BoxGeometry();
        //     const material = new THREE.MeshBasicMaterial({ 
        //         color: 0x00ff00,
        //         wireframe: true // 线框模式，便于观察立方体结构
        //     });
            
        //     // 创建网格并添加到场景
        //     const cube = new THREE.Mesh(geometry, material);
        //     scene.add(cube);

        // 渲染循环
        const animate = () => {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        };
        animate();
        return () => mountRef.current?.removeChild(renderer.domElement);
    }, []);

    // 声明一个函数用于创建地图形状
    function createSichuanShape(scene: { add: (arg0: any) => void; }, jsonData) {
        // 解析json数据
        // const jsonData = JSON.parse(sichuanJson);
        // 创建一个分组，把地图中的多个图形放在一个组中，便于管理
        const sichuan = new THREE.Group();
        // 使用d3把经纬度转换成平面坐标
        const projection = D3.geoMercator().center([104.065735, 30.659462])
        // 遍历json数据中的features
        jsonData.features.forEach((feature, i) => {
            // 获取feature中的geometry数据，方便引用
            const geometry = feature.geometry;
            const type = geometry.type;
            // 创建分组，把同一个市的形状放在一个分组，便于管理
            const city = new THREE.Group();
            if (type === 'MultiPolygon') {//"MultiPolygon"
                // 遍历geometry中的数据 coordinates
                geometry.coordinates.forEach((multipolygon) => {
                    // 创建形状，用于展示地理形状
                    const shape = new THREE.Shape()
                    // 存储每个坐标，用于绘制边界线
                    const arr = []
                    multipolygon.forEach((polygon) => {
                        polygon.forEach((item, index) => {
                            // 使用d3转换坐标
                            const [x, y] = projection.translate([0, 0])(item);
                            // 根据转换后的坐标绘制形状
                            if (index === 0) {
                                shape.moveTo(x, y)
                            } else {
                                shape.lineTo(x, y)
                            }
                            arr.push(x, y, 3)
                        });
                    })
                    // 绘制边界线
                    // createLine(arr, city)
                    // 创建 ExtrudeGeometry用于显示3d效果
                    const extrudGeometry = new THREE.ExtrudeGeometry(shape, {
                        depth: 2 // 地图的厚度
                    })
                    // 创建材质，用于显示地图的外观
                    const material = new THREE.MeshBasicMaterial({
                        color: 'red'
                    });
                    // 创建物体，用于显示地图
                    const mesh = new THREE.Mesh(extrudGeometry, material)
                    mesh.position.set(10, 10, 10)
                    // 添加到分组
                    city.add(mesh)
                })
            }
            // 添加到分组
            sichuan.add(city)
        })
        // 添加到场景
        console.log(sichuan)
        scene.add(sichuan)
    }
    // 用于创建边界线
    function createLine(points, container) {
        // console.log(points)
        // console.log(container)
        const buffGeometry = new THREE.BufferGeometry();
        buffGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(points), 3))
        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0xff0000
        })
        const line = new THREE.Line(buffGeometry, lineMaterial)
        container.add(line)
    }
    useEffect(() => {
        //    console.log('mountRef', mountRef.current?.parentElement.clientHeight)
        let width = mountRef.current?.parentElement.clientWidth;
        let height = mountRef.current?.parentElement.clientHeight;
        console.log('width', width)
        console.log('height', height)
    }, [mountRef]);

    return <div ref={mountRef} style={{ width: '100%', height: '100%' }} />;
};

export default MapPage;

