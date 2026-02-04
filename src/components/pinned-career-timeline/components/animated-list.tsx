import React, { useRef, useState, useEffect, useCallback, useMemo, type ReactNode, type MouseEventHandler, type UIEvent } from 'react';
import gsap from 'gsap';

interface AnimatedItemProps {
  children: ReactNode;
  index: number;
  onMouseEnter?: MouseEventHandler<HTMLDivElement>;
  onClick?: MouseEventHandler<HTMLDivElement>;
}

const AnimatedItem: React.FC<AnimatedItemProps> = ({ children, index, onMouseEnter, onClick }) => {
  return (
    <div
      data-index={index}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      className="mb-4 cursor-pointer"
    >
      {children}
    </div>
  );
};

interface MilestoneItem {
  title: string;
  description: string;
}

interface AnimatedListProps {
  items?: MilestoneItem[] | string[];
  onItemSelect?: (item: string | MilestoneItem, index: number) => void;
  showGradients?: boolean;
  className?: string;
  itemClassName?: string;
  displayScrollbar?: boolean;
  initialSelectedIndex?: number;
}

export const AnimatedList: React.FC<AnimatedListProps> = ({
  items = [],
  onItemSelect,
  showGradients = true,
  className = '',
  itemClassName = '',
  displayScrollbar = false,
  initialSelectedIndex = -1
}) => {
  const listRef = useRef<HTMLDivElement>(null);
  const itemsContainerRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(initialSelectedIndex);
  const [keyboardNav, setKeyboardNav] = useState<boolean>(false);
  const [topGradientOpacity, setTopGradientOpacity] = useState<number>(0);
  const [bottomGradientOpacity, setBottomGradientOpacity] = useState<number>(1);
  const animationTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const previousItemsRef = useRef<string>('');
  
  // Generar una key única basada en los items
  const itemsKey = useMemo(() => {
    if (items.length === 0) return '';
    // Si son objetos con title y description, usar ambos para la key
    if (typeof items[0] === 'object' && 'title' in items[0]) {
      return (items as MilestoneItem[]).map(item => `${item.title}|${item.description}`).join('||');
    }
    // Si son strings, usar el método anterior
    return (items as string[]).join('|');
  }, [items]);
  
  // Resetear selectedIndex cuando cambian los items
  useEffect(() => {
    setSelectedIndex(initialSelectedIndex);
  }, [itemsKey, initialSelectedIndex]);

  // Animar items cuando cambian usando GSAP
  useEffect(() => {
    const container = itemsContainerRef.current;
    if (!container) return;
    
    const itemElements = Array.from(container.querySelectorAll('[data-item-index]')) as HTMLElement[];
    if (itemElements.length === 0) return;
    
    // Si los items cambiaron, detener animación anterior y crear nueva
    if (previousItemsRef.current !== itemsKey) {
      // Detener y limpiar timeline anterior
      if (animationTimelineRef.current) {
        animationTimelineRef.current.kill();
        animationTimelineRef.current = null;
      }
      
      // Ocultar todos los items primero
      gsap.set(itemElements, { scale: 0.7, opacity: 0 });
      
      // Crear nueva timeline para animar entrada
      const tl = gsap.timeline();
      itemElements.forEach((element, index) => {
        tl.to(element, {
          scale: 1,
          opacity: 1,
          duration: 0.25,
          ease: "power2.out"
        }, index * 0.05);
      });
      
      animationTimelineRef.current = tl;
      previousItemsRef.current = itemsKey;
    }
    
    return () => {
      if (animationTimelineRef.current) {
        animationTimelineRef.current.kill();
        animationTimelineRef.current = null;
      }
    };
  }, [itemsKey, items.length]);

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target as HTMLDivElement;
    setTopGradientOpacity(Math.min(scrollTop / 50, 1));
    const bottomDistance = scrollHeight - (scrollTop + clientHeight);
    setBottomGradientOpacity(scrollHeight <= clientHeight ? 0 : Math.min(bottomDistance / 50, 1));
  };

  useEffect(() => {
    if (!keyboardNav || selectedIndex < 0 || !listRef.current) return;
    const container = listRef.current;
    const selectedItem = container.querySelector(`[data-index="${selectedIndex}"]`) as HTMLElement | null;
    if (selectedItem) {
      const extraMargin = 50;
      const containerScrollTop = container.scrollTop;
      const containerHeight = container.clientHeight;
      const itemTop = selectedItem.offsetTop;
      const itemBottom = itemTop + selectedItem.offsetHeight;
      if (itemTop < containerScrollTop + extraMargin) {
        container.scrollTo({ top: itemTop - extraMargin, behavior: 'smooth' });
      } else if (itemBottom > containerScrollTop + containerHeight - extraMargin) {
        container.scrollTo({
          top: itemBottom - containerHeight + extraMargin,
          behavior: 'smooth'
        });
      }
    }
    setKeyboardNav(false);
  }, [selectedIndex, keyboardNav]);

  return (
    <div className={`relative w-[1000px] ${className}`}>
      <div
        ref={listRef}
        className={`max-h-[500px] overflow-y-auto p-4 ${
          displayScrollbar
            ? '[&::-webkit-scrollbar]:w-[8px] [&::-webkit-scrollbar-track]:bg-[#060010] [&::-webkit-scrollbar-thumb]:bg-[#222] [&::-webkit-scrollbar-thumb]:rounded-[4px]'
            : 'scrollbar-hide'
        }`}
        onScroll={handleScroll}
        style={{
          scrollbarWidth: displayScrollbar ? 'thin' : 'none',
        }}
      >
        <div ref={itemsContainerRef}>
          {items.map((item, index) => {
            const title = typeof item === 'string' ? item : item.title;
            const description = typeof item === 'object' && 'description' in item ? item.description : null;
            
            return (
              <AnimatedItem
                key={`${itemsKey}-${index}`}
                index={index}
              >
                <div data-item-index={index} className={`p-4 rounded-lg ${itemClassName}`}>
                  <p className="font-bold text-2xl">{title}</p>
                  {description && (
                    <p className="text-text-secondary text-base">{description}</p>
                  )}
                </div>
              </AnimatedItem>
            );
          })}
        </div>
      </div>
      {showGradients && (
        <>
          <div
            className="absolute top-0 left-0 right-0 h-[50px] bg-gradient-to-b from-background to-transparent pointer-events-none transition-opacity duration-300 ease"
            style={{ opacity: topGradientOpacity }}
          ></div>
          <div
            className="absolute bottom-0 left-0 right-0 h-[100px] bg-gradient-to-t from-background to-transparent pointer-events-none transition-opacity duration-300 ease"
            style={{ opacity: bottomGradientOpacity }}
          ></div>
        </>
      )}
    </div>
  );
};
