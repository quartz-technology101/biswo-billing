import { RadioGroup } from "@headlessui/react";

export default function ShortBy({ setSortByData, sortData, name }) {
  const plans = [
    {
      name: "Latest",
      collection: name,
      id: 1,
    },
    {
      name: "Name (A-Z)",
      id: 2,
    },
    {
      name: "Name (Z-A)",
      id: 3,
    },
    {
      name: "Oldest",
      collection: name,
      id: 4,
    },
  ];
  return (
    <div className="w-full px-0 pt-2 sm:pb-2">
      <div className="mx-auto w-full max-w-xl">
        <RadioGroup value={sortData} onChange={(value) => setSortByData(value)}>
          <div className="space-y-3">
            {plans.map((plan) => (
              <RadioGroup.Option
                key={plan.id}
                value={plan.id}
                type="button"
                className={({ active, checked }) =>
                  `${
                    active
                      ? "ring-2 ring-white ring-opacity-60 ring-offset-2 ring-offset-green-300"
                      : ""
                  }
                  ${
                    checked
                      ? "primary-background-color"
                      : "bg-gray-300 hover:bg-gray-200"
                  }
                    relative flex cursor-pointer rounded-lg px-4 py-1.5 sm:py-2 shadow-md focus:outline-none`
                }
              >
                {({ active, checked }) => (
                  <>
                    <div className="flex w-full items-center justify-between">
                      <div className="flex items-center">
                        <div className="text-xs sm:text-sm">
                          <RadioGroup.Label
                            as="p"
                            className={`font-medium  ${
                              checked ? "text-white" : "text-black"
                            }`}
                          >
                            {plan.name} {plan.collection}
                          </RadioGroup.Label>
                        </div>
                      </div>
                      {checked ? (
                        <div className="shrink-0 text-white">
                          <CheckIcon
                            className="h-6 w-6"
                            d="M7 13l3 3 7-7"
                            opacity="0.2"
                          />
                        </div>
                      ) : (
                        <div className="shrink-0 text-white">
                          <CheckIcon className="h-6 w-6" d="" opacity="0.5" />
                        </div>
                      )}
                    </div>
                  </>
                )}
              </RadioGroup.Option>
            ))}
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}

function CheckIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={props.className}>
      <circle cx={12} cy={12} r={12} fill="#fff" opacity={props.opacity} />
      <path
        d={props.d}
        stroke="#fff"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
