export function SketchFilter() {
  return (
    <svg
      id="sketch-filters"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        position: 'absolute',
        width: 0,
        height: 0,
        overflow: 'hidden',
      }}
    >
      <defs>
        {/* Main rough sketch filter - high displacement */}
        <filter id="rough-sketch" x="-50%" y="-50%" width="200%" height="200%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.05"
            numOctaves="3"
            seed="1"
            result="turbulence"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="turbulence"
            scale="8"
            xChannelSelector="R"
            yChannelSelector="G"
            result="displaced"
          />
          <feMorphology operator="dilate" radius="0.5" in="displaced" result="thick" />
          <feGaussianBlur stdDeviation="0.5" in="thick" result="blurred" />
          <feComposite in="SourceGraphic" in2="blurred" operator="over" />
        </filter>

        {/* Variant 2 - different wobble pattern */}
        <filter id="rough-sketch-2" x="-50%" y="-50%" width="200%" height="200%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.06"
            numOctaves="3"
            seed="42"
            result="turbulence"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="turbulence"
            scale="7"
            xChannelSelector="G"
            yChannelSelector="B"
            result="displaced"
          />
          <feMorphology operator="dilate" radius="0.6" in="displaced" result="thick" />
          <feGaussianBlur stdDeviation="0.6" in="thick" result="blurred" />
          <feComposite in="SourceGraphic" in2="blurred" operator="over" />
        </filter>

        {/* Variant 3 - stronger distortion */}
        <filter id="rough-sketch-3" x="-50%" y="-50%" width="200%" height="200%">
          <feTurbulence
            type="turbulence"
            baseFrequency="0.04"
            numOctaves="4"
            seed="99"
            result="turbulence"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="turbulence"
            scale="10"
            xChannelSelector="B"
            yChannelSelector="R"
            result="displaced"
          />
          <feMorphology operator="dilate" radius="0.7" in="displaced" result="thick" />
          <feGaussianBlur stdDeviation="0.7" in="thick" result="blurred" />
          <feComposite in="SourceGraphic" in2="blurred" operator="over" />
        </filter>

        {/* Pencil texture overlay */}
        <filter id="pencil-texture">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="4"
            result="noise"
          />
          <feColorMatrix
            in="noise"
            type="matrix"
            values="0 0 0 0 0
                    0 0 0 0 0
                    0 0 0 0 0
                    0 0 0 -1.5 1.5"
            result="texture"
          />
          <feComposite
            in="SourceGraphic"
            in2="texture"
            operator="arithmetic"
            k1="0"
            k2="1"
            k3="0.15"
            k4="0"
          />
        </filter>
      </defs>
    </svg>
  )
}